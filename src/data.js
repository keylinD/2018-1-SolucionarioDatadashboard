window.computeUsersStats = (
  users, //Arreglo de usuarios directo desde users.json
  progress, //Objeto de progreso directo desde progress.json
  courses // Arreglo de índices de cursos desde el cohort seleccionado
) => {
  for (let i = 0; i < users.length; i++) {
    let userId = users[i].id;
    /*
      Puedo acceder de esta forma al progreso del usuario
      gracias a que la llave de cada progreso es el id
      del usuario
    */
    let userProgress = progress[userId];
    for (let j = 0; j < userProgress.length; j++) {
      if (JSON.stringify(userProgress[j]) === '{}') { // Esto permite que si un usuario no ha completado nada, se le agreguen datos en 0. Asumo que esto evita que salga undefined en algunas personas. 
        user[i].stats = {
          percent: 0,
          exercises: { percent: 0, },
          reads: { percent: 0, },
          quizzes: {
            percent: 0,
            scoreAvg: 0,
          }
        };
      }else{
        // inicializa en cero para luego hacer un contador.
        // for in recorre las llaves y el for of recorre el value.
        let percentGral;
        let lectures = 0;
        let lecturesCompleted = 0;
        let lecturesPercent;
        let quizzes = 0;
        let quizzesCompleted = 0;
        let quizzesPercent;
        let exercises = 0;
        let exercisesCompleted = 0;
        let exercisesPercent;

        // Esto irá recorriendo cada id de curso
        for (let i in userProgress) {
          let element = userProgress[i];
          for (let unit of Object.values(element.units)) {
            // el object.value depende del js, a veces no lo necesita
            // for of nunca va a fallar, no da error en el i de indice.
            // con for of recorre por todas las propiedades del objeto y no por los keys
            for (let part of Object.values(unit.parts)) { //aca recorremos las partes, las partes pueden ser lecturas, quizes, exercise, etc
              // acá verifica si tuvo lecturas
              if (part.type === 'read') {
                lectures++;
              }
              if (part.length === 0) {
                lectures = 0;
                percentGral = 0;
              }

              // acá verifica si las completo.
              // consejo de caro, colocar el tipo para no obtener porcentajes raros.
              // esto es para un curso o tema en particular.
              if (part.type === 'read' && part.completed === 1) {// si la part.type === reads y completed es =1 entonces se incrementa el contador de lecturas completadas, ya que ademas de tener lecturas deben estar completadas, para entender mejor las parts ver el json de progress
                lecturesCompleted++;
              }
              //en esta parte se calcula el resultado del porcentaje de lecturas
              // math.round para redondear resultado
              // el math.round tambien sirve para que no de decimales raros
              //  sacar el % fuera del for para evitar que recalcule
              // para redondear con 2 decimales multiplicas *100, redondeas y dividimos por 100
              lecturesPercent = Math.round((lecturesCompleted*100)/lectures);
              // si la part.type es un quizz aumenta el contador de quizzes        
             if (part.type === 'quiz') { //type es la llave que hay en el objeto que estamos recorriendo
               quizzes++;
             }
             if (part.type === 'quiz' && part.completed === 1) {
              quizzesCompleted++;
             }
             //en este caso si la part.length = 0 quiere decir que NO tiene datos en su interior 
             //asi que para que los contadores no se aumenten, se les da el valor de cero
             if (part.length === 0) {
               quizzes = 0;
               percentGral = 0;
               exercises = 0;
               lectures = 0;               
             }
              // si la part.type es una practice aumenta el contador de exercises             
             if (part.type === 'practice') {
               exercises++;
             }
             if (part.type === 'practice' && part.completed === 1) {
               exercisesCompleted++;
             }
             exercisesPercent = Math.round((exercisesCompleted*100) / exercises);
             percentGral = Math.round((lecturesPercent + quizzesPercent + exercisesPercent) / 3);
            } //aca termina el for que recorre las parts
          }
        } 
      }
    }

  }
}