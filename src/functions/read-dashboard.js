const pool = require('../db');

class AnalyticsService {
    static async getTramitesPorEstado() {
        let connection;
        try {
            connection = await pool.getConnection();
            const [results] = await connection.query(
                `SELECT status, COUNT(*) AS cantidad
                 FROM tramite
                 GROUP BY status`
            );
            return results;
        } catch (error) {
            console.error('Error al obtener trámites por estado:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getTramitesPorTema() {
        let connection;
        try {
            connection = await pool.getConnection();
            const [results] = await connection.query(
                `SELECT tema.descripcion, COUNT(*) AS cantidad
                 FROM tramite
                 JOIN tema ON tramite.tema_id = tema.id
                 GROUP BY tema.descripcion`
            );
            return results;
        } catch (error) {
            console.error('Error al obtener trámites por tema:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getCantidadTramitesPorNivelEducativo() {
        let connection;
        try {
            connection = await pool.getConnection();
            const [results] = await connection.query(
                `SELECT niveleducativo.nivel, COUNT(*) AS cantidad
                 FROM tramite
                 JOIN niveleducativo ON tramite.nivel_id = niveleducativo.id
                 GROUP BY niveleducativo.nivel`
            );
            return results;
        } catch (error) {
            console.error('Error al obtener la cantidad de trámites por nivel educativo:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getCantidadTramitesPorMunicipio() {
        let connection;
        try {
            connection = await pool.getConnection();
            const [results] = await connection.query(
                `SELECT municipio.nombre, COUNT(*) AS cantidad
                 FROM tramite
                 JOIN municipio ON tramite.municipio_id = municipio.id
                 GROUP BY municipio.nombre`
            );
            return results;
        } catch (error) {
            console.error('Error al obtener la cantidad de trámites por municipio:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getCantidadPersonasPorNivelEducativo() {
        let connection;
        try {
            connection = await pool.getConnection();
            const [results] = await connection.query(
                `SELECT niveleducativo.nivel, COUNT(distinct persona.id) AS cantidad
                 FROM persona
                 JOIN tramite ON persona.id = tramite.persona_id
                 JOIN niveleducativo ON tramite.nivel_id = niveleducativo.id
                 GROUP BY niveleducativo.nivel`
            );
            return results;
        } catch (error) {
            console.error('Error al obtener la cantidad de personas por nivel educativo:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

}
module.exports = AnalyticsService;