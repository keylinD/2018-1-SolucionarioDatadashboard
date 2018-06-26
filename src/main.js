let users = null;
let progress = null;
let cohorts = null; //null == false => true
// null para que sea false siempre, llaves no, corchetes si.
let usersStats = null;

// se utiliza el link de git para no usar el server 
//el link es hacia una api de ususarios que esta online
fetch('https://fabianbravoa.github.io/2018-1-SolucionarioDatadashboard/data/cohorts/lim-2018-03-pre-core-pw/users.json')
  .then(response => response.json())
  .then(usersJSON => {
    users = usersJSON;
    areWeFinishedYet();
  })
  .catch(error => {
    console.error("No pudimos obtener usuarios");
    //console.error indica un mensaje de error, indica una alerta grave
    console.error("ERROR > " + error.stack); //error.stack muestra donde falló el codigo, imprime donde esta el error
  });
// se utiliza url relativa de gh pages.
fetch('https://fabianbravoa.github.io/2018-1-SolucionarioDatadashboard/data/cohorts/lim-2018-03-pre-core-pw/progress.json')
  .then(response => response.json())
  .then(progressJSON => {
    progress = progressJSON;
    areWeFinishedYet();
  })
  .catch(error => {
    console.error("No pudimos obtener el progreso");
    console.error("ERROR > " + error.stack);
  });

fetch('https://fabianbravoa.github.io/2018-1-SolucionarioDatadashboard/data/cohorts.json')
  .then(response => response.json())
  .then(cohortsJSON => {
    cohorts = cohortsJSON;
    areWeFinishedYet();//se llama en todas las respuestas por que no sabemos cual llegara primero y asi nos aseguramos si se ejecutan
  })
  .catch(error => {
    console.error("No pudimos obtener el listado de cohorts");
    console.error("ERROR > " + error.stack);
  });

function areWeFinishedYet() { //¿hemos terminado?
  // se llama desde todas las promesas para que tome los tome en cuenta sin importar cual de ellos se ejecute primero
  //vemos si users progress y cohorts ya tienen datos en su interior sino no se ejecuta
  if (users && progress && cohorts) {
    const cohort = cohorts.find(item => item.id === 'lim-2018-03-pre-core-pw'); //busca el cohort que tiene ese id ya que este es el unico cohort que esta en los json
    const courses = Object.keys(cohort.coursesIndex);
    // guardamos el resultado de llamar a la funcion en una variable global    
    usersStats = window.computeUsersStats(users, progress, courses);//recibe users, progress y el listado de los cursos del cohort
  }
}
//se declara la funcion para darle funcionalidad al boton toggler y que cambie al darle click
function onToggleSort() {
  const direction = toggleSort.innerText;
  if (direction == "ASC") {
    toggleSort.innerText = "DESC";
  } else {
    toggleSort.innerText = "ASC";
  }
  //llamamos a la funcion de ordenamiento para que que ordene los usuarios
  const sortedUsers = window.sortUsers(usersStats, "percent", direction);
  //no se hace el getElementById por que en JS todo lo declarado en el html con un id queda como variable global :O
  studentContainer.innerHTML = "";
  for(let student of sortedUsers){
    studentContainer.innerHTML += `
      <p>${student.name} ${student.stats.percent}</p>
    `;
  }
}

function onSearchBoxChange(){
  const search = searchBox.value;
  const filteredUsers = window.filterUsers(usersStats, search);
  studentContainer.innerHTML = "";
  filteredUsers.forEach(student => {
    studentContainer.innerHTML += `
      <p>${student.name}</p>
    `;
  });
}