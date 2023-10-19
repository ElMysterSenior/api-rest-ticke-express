const pool = require('../db');

class TramiteHandler {

  //INSERTAR TRAMITE
    static async insertIntermediario(connection, nombreCompleto) {
        const [results] = await connection.query(
            'INSERT INTO intermediario (nombreCompleto) VALUES (?)',
            [nombreCompleto]
        );
        return results.insertId;
    }

    static async insertPersona(connection, { curp, nombre, paterno, materno, telefono, celular, correo }) {
        const [results] = await connection.query(
            'INSERT INTO persona (curp, nombre, paterno, materno, telefono, celular, correo) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [curp, nombre, paterno, materno, telefono, celular, correo]
        );
        return results.insertId;
    }

    static async insertTramite(connection, { intermediario_id, persona_id, nivel_id, municipio_id, tema_id }) {
        const [results] = await connection.query(
            'INSERT INTO tramite (intermediario_id, persona_id, nivel_id, municipio_id, tema_id) VALUES (?, ?, ?, ?, ?)',
            [intermediario_id, persona_id, nivel_id, municipio_id, tema_id]
        );
        return results.insertId;
    }

    static async insertTramiteCompleto(data) {
      console.log(data); 
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const intermediarioId = await this.insertIntermediario(connection, data.nombreCompleto);
            const personaId = await this.insertPersona(connection, data);
            const tramiteId = await this.insertTramite(connection, { 
              intermediario_id: intermediarioId, 
              persona_id: personaId, 
              nivel_id: data.nivel, 
              municipio_id: data.municipio, 
              tema_id: data.tema 
          });
          
            await connection.commit();

            return { intermediarioId, personaId, tramiteId };
        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Error al insertar datos:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    //VER TRAMITE POR CURP
    static async getTramitePorCURP(curp) {
      let connection;
      try {
        connection = await pool.getConnection();
          const [results] = await connection.query(
            `SELECT 
            tramite.id AS tramite_id,
            intermediario.nombreCompleto AS intermediario_nombre,
            persona.curp, persona.nombre, persona.paterno, persona.materno,
            persona.telefono, persona.celular, persona.correo,
            niveleducativo.nivel AS nivel_descripcion,
            municipio.nombre AS municipio_nombre,
            tema.descripcion AS tema_descripcion,
            tramite.status AS tramite_status  -- Nueva línea
         FROM tramite
         JOIN intermediario ON tramite.intermediario_id = intermediario.id
         JOIN persona ON tramite.persona_id = persona.id
         JOIN niveleducativo ON tramite.nivel_id = niveleducativo.id
         JOIN municipio ON tramite.municipio_id = municipio.id
         JOIN tema ON tramite.tema_id = tema.id
         WHERE persona.curp = ?`,
              [curp]
          );
          return results;
      } catch (error) {
          console.error('Error al obtener datos del trámite:', error);
          throw error;
      }
    }

    static async updateIntermediario(connection, curp, nombreCompleto) {
      // Solo actualiza si nombreCompleto está presente
      if (nombreCompleto) {
          await connection.query(
              'UPDATE intermediario SET nombreCompleto = ? WHERE id IN (SELECT intermediario_id FROM tramite JOIN persona ON tramite.persona_id = persona.id WHERE persona.curp = ?)',
              [nombreCompleto, curp]
          );
      }
      // Si no, no hagas nada para 'intermediario'
  }

  static async updatePersona(connection, curp, datosPersona) {
      // Construye dinámicamente la consulta SQL y los parámetros basados en los campos presentes
      let updates = [];
      let params = [];
      for (let [key, value] of Object.entries(datosPersona)) {
          if (value != null) { // si el valor es null o undefined, no lo incluyas
              updates.push(`${key} = ?`);
              params.push(value);
          }
      }

      if (updates.length > 0) {
          // Solo ejecuta la actualización si hay al menos un campo para actualizar
          const sql = `UPDATE persona SET ${updates.join(', ')} WHERE curp = ?`;
          params.push(curp);
          await connection.query(sql, params);
      }
      // Si no, no hagas nada para 'persona'
  }

  static async updateTramite(connection, curp, datosTramite) {
      // Similar a 'updatePersona', construimos la consulta basada en los datos presentes
      let updates = [];
      let params = [];
      for (let [key, value] of Object.entries(datosTramite)) {
          if (value != null) {
              updates.push(`${key} = ?`);
              params.push(value);
          }
      }

      if (updates.length > 0) {
          // Solo ejecuta la actualización si hay campos para actualizar
          const sql = `UPDATE tramite SET ${updates.join(', ')} WHERE persona_id = (SELECT id FROM persona WHERE curp = ?)`;
          params.push(curp);
          await connection.query(sql, params);
      }
      // Si no, no hagas nada para 'tramite'
  }

    // Método que coordina la actualización
    static async actualizarTramiteCompletoPorCurp(curp, datos) {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            // Actualizar intermediario
            if (datos.nombreCompleto) {
                await this.updateIntermediario(connection, curp, datos.nombreCompleto);
            }

            // Actualizar persona
            await this.updatePersona(connection, curp, datos);

            // Actualizar trámite si los datos están presentes
            if (datos.nivel_id || datos.municipio_id || datos.tema_id) {
                await this.updateTramite(connection, curp, datos);
            }

            await connection.commit(); // todo fue exitoso, así que confirmamos la transacción
        } catch (error) {
            if (connection) {
                await connection.rollback(); // si hay un error, deshacemos la transacción
            }
            throw error; // relanzamos el error
        } finally {
            if (connection) {
                connection.release(); // liberamos la conexión en cualquier caso
            }
        }
    }
}
    
    
    


module.exports = TramiteHandler;
