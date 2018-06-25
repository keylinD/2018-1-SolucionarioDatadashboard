window.computeUsersStats = (users, progress, courses)=>{
  for (let i= 0; i < users.length; i++){
    let userId = users[i].id;
    let userProgress = progress[userId];
    for (let j = 0; j< userProgress.length;j++){
      if (JSON.stringify(userProgress[j])==='{}'){
        user[i].stats = {
          percent: 0,
          exercises:{percent:0,},
          reads: {percent:0,},
          quizzes: {
            percent:0,
            scoreAvg:0,
          }
        }
      }
    }

  }
}