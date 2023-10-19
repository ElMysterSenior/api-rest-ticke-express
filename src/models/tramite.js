class Tramite {
    constructor(id, intermediario_id, persona_id, nivel_id, municipio_id, tema_id) {
      this.id = id; // Autoincremental en la base de datos
      this.intermediario_id = intermediario_id; // ID del intermediario
      this.persona_id = persona_id; // ID de la persona
      this.nivel_id = nivel_id; // ID del nivel educativo
      this.municipio_id = municipio_id; // ID del municipio
      this.tema_id = tema_id; // ID del tema a tratar
    }
  }
  