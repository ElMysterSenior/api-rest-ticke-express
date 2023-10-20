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
            intermediario.nombreCompleto AS nombreCompleto,
            persona.curp, persona.nombre, persona.paterno, persona.materno,
            persona.telefono, persona.celular, persona.correo,
            niveleducativo.nivel AS nivelEducativo,
            municipio.nombre AS municipio,
            tema.descripcion AS tema,
            tramite.status AS status  -- Nueva línea
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


    //UPDATE POR CURP
    static async actualizarTramitePorCurp(curp, datos) {
      let connection;
      try {
          connection = await pool.getConnection();
          await connection.beginTransaction();
  
          // Obtenemos los ID relevantes basados en el CURP
          const [rows] = await connection.execute(`
              SELECT 
                  tramite.id AS tramite_id, 
                  tramite.intermediario_id,
                  tramite.persona_id,
                  tramite.nivel_id,
                  tramite.municipio_id,
                  tramite.tema_id
              FROM tramite
              INNER JOIN persona ON tramite.persona_id = persona.id
              WHERE persona.curp = ?
          `, [curp]);
  
          if (rows.length === 0) {
              throw new Error("No se encontró trámite para el CURP proporcionado");
          }
  
          const ids = rows[0];
  
          // Actualizamos la tabla intermediario si es necesario
          if (datos.nombreCompleto) {
              await connection.execute(`UPDATE intermediario SET nombreCompleto = ? WHERE id = ?`, [datos.nombreCompleto, ids.intermediario_id]);
          }
  
          // Actualizamos la tabla persona si es necesario
          if (datos.nombre || datos.paterno || datos.materno || datos.telefono || datos.celular || datos.correo) {
              await connection.execute(`
                  UPDATE persona 
                  SET nombre = ?, paterno = ?, materno = ?, telefono = ?, celular = ?, correo = ?
                  WHERE id = ?
              `, [datos.nombre, datos.paterno, datos.materno, datos.telefono, datos.celular, datos.correo, ids.persona_id]);
          }
  
          // Actualizamos la tabla tramite si es necesario
          if (datos.nivel_id || datos.municipio_id || datos.tema_id || datos.status) {
            await connection.execute(`
                UPDATE tramite 
                SET nivel_id = ?, municipio_id = ?, tema_id = ?, status = ?
                WHERE id = ?
            `, [datos.nivel_id || ids.nivel_id, datos.municipio_id || ids.municipio_id, datos.tema_id || ids.tema_id, datos.status, ids.tramite_id]);
        }
  
          await connection.commit(); // Todo fue exitoso, así que confirmamos la transacción
      } catch (error) {
          if (connection) await connection.rollback(); // Si hay un error, deshacemos la transacción
          throw error; // Relanzamos el error
      } finally {
          if (connection) connection.release(); // Liberamos la conexión de vuelta al pool
      }
  }

  //DELETE POR CURP

      static async deleteTramitePorCURP(curp) {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            // Obtenemos los IDs relevantes basados en el CURP
            const [rows] = await connection.execute(`
                SELECT 
                    tramite.id AS tramite_id,
                    tramite.intermediario_id,
                    tramite.persona_id
                FROM 
                    tramite
                INNER JOIN 
                    persona ON tramite.persona_id = persona.id
                WHERE 
                    persona.curp = ?
            `, [curp]);

            if (rows.length === 0) {
                throw new Error("No se encontró trámite para el CURP proporcionado");
            }

            const ids = rows[0];

            // Eliminamos el trámite
            await connection.execute('DELETE FROM tramite WHERE id = ?', [ids.tramite_id]);

            // Eliminamos la entrada de persona
            await connection.execute('DELETE FROM persona WHERE id = ?', [ids.persona_id]);

            // Eliminamos la entrada de intermediario
            await connection.execute('DELETE FROM intermediario WHERE id = ?', [ids.intermediario_id]);

            // Si todo ha ido bien, confirmamos la transacción
            await connection.commit();
        } catch (error) {
            if (connection) await connection.rollback(); // Si hay un error, deshacemos la transacción
            console.error('Error al eliminar datos:', error);
            throw error; // Relanzamos el error
        } finally {
            if (connection) connection.release(); // Liberamos la conexión de vuelta al pool
        }
    }
}




module.exports = TramiteHandler;
