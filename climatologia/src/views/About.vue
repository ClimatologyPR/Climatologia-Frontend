<template>
  <div class="body about">
    <h1>Bienvenidos al sitio web Climatología de Puerto Rico</h1>
    <p class="glassBorder">Esta página es un
      servicio de la Oficina de Climatología de Puerto Rico, con sede en la
      Facultad de Artes y Ciencias del Recinto Universitario de Mayagüez,
      Universidad de Puerto Rico. Éste es un trabajo en progreso que tiene como
      meta facilitar el accesso a información climatológica sobre Puerto Rico a
      través de una herramienta abierta a toda la comunidad, rápida e intuitiva
      para cualquier usuario. En esta etapa inicial estamos proveyendo datos de
      precipitación de estaciones comunitarias que reportan sus datos al
      National Oceanic and Atmospheric Administration (NOAA) y estaciones del
      United States Geological Service (USGS). También hay datos de Temperatura
      Máxima y Mínima de las estaciones reportadas a NOAA. Estamos trabajando
      para actualizar datos históricos de todas las estaciones desde la primera
      fecha disponible en los registros existentes.
    </p>
    <div class="emailSection glassBorder">
      
      <h3>Para más información, nos puede escribir a los siguientes correos:</h3>
      <ul>
      <li>
      Annie Plaza Rodríguez, Asistente Administrativo ➜ <a href="mailto:annie.plaza@upr.edu">annie.plaza@upr.edu</a>
      </li>
      <li>
      Héctor J Jiménez Ph.D., Director ➜ <a href="mailto:hectorj.jimenez@upr.edu">hectorj.jimenez@upr.edu</a>
      </li>
      </ul>
    </div>


  </div>
</template>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  background: inherit;
  align-items: center;
  height: 100%;
  color: var(--h1);
  font-family: "Lato", sans-serif;
  font-size: 2.2vh;
  text-shadow: 0px 0px 1px black ;
}

.glassBorder{
  margin-top: 24px;
  backdrop-filter: blur(10px);
  box-shadow: inset 0px 0px 2000px rgba(51, 51, 51, 0.377),
    0px 5px 25px rgba(24, 24, 24, 0.363);
    padding: 32px;
    border-radius: 20px;
    max-width: 1440px;
}

.emailSection a{
  color: rgb(30, 190, 56);
  text-shadow: none;
}
</style>
