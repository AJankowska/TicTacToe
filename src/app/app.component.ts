import { Component } from '@angular/core';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  socket;
  
  constructor(){
    this.socket = io();
    this.socket.on('message', this.showMsg);
    this.socket.on("activeUpdateBoard", this.updateBoard);
    this.socket.on("nonActiveUpdateBoard",this.justShow)
      
  }
  
   wonGames:number=0;
   tieGames:number=0;
   lostGames:number=0;
   allGames:number=0;
   wonPercent:number=0;
   lostPercent:number=0;
   tiePercent:number=0;
   restart:boolean=false;
   playAgain(){
     this.socket.emit("PlayAgain");
     this.restart=false;
   }
  showMsg = (msg:string)=>{
  
        const box = document.getElementById("box");
       const boxex = document.getElementById("boxextended");
        const main = document.getElementById("divMain");
        const header = document.createElement('p');
   
       header.setAttribute("class","lead");
        if(msg=="Wygrałeś") {
          main.setAttribute("class","winner");
          boxex.setAttribute("class","winner");
      this.wonGames++;
      this.allGames++;
      
    }
    else if (msg=="Przegrałeś") {
      main.setAttribute("class", "looser");
       boxex.setAttribute("class", "looser");
       this.allGames++;
      this.lostGames++;
     
    }
    else if (msg=="Remis"){
      main.setAttribute("class","tie");
      boxex.setAttribute("class", "tie");
      this.allGames++;
      this.tieGames++;  
    } 
   
    while(box.firstChild){box.removeChild(box.firstChild)}
    header.innerHTML = msg;
    box.appendChild(header);
    if(this.allGames!==0){
      this.restart=true;
      this.wonPercent=this.wonGames*100/this.allGames;
      this.lostPercent=this.lostGames*100/this.allGames;
      this.tiePercent=this.tieGames*100/this.allGames;

    }
     }
    
  
    

 
  updateBoard = (board)=>{
    //pisane odręcznie trzeba zautomatyzować
    const div = document.getElementById("divMain");
    div.innerHTML="<table><tr><td class='cell' id='0'>"+board[0]+"</td><td class='cell' id='1'>"+board[1]+"</td><td class='cell' id='2'>"+board[2]+"</td></tr><tr><td class='cell' id='3'>"+board[3]+"</td><td class='cell' id='4'>"+board[4]+"</td><td class='cell' id='5'>"+board[5]+"</td></tr><tr><td class='cell' id='6'>"+board[6]+"</td><td class='cell' id='7'>"+board[7]+"</td><td class='cell' id='8'>"+board[8]+"</td></tr></table>";
    for(let i=0;i<9;i++){
      if(board[i]==" "){
        document.getElementById(i.toString()).setAttribute("class","clickable");
        document.getElementById(i.toString()).addEventListener("click",()=>
        this.socket.emit("onTurn",i));
      }
    }
    
  }
  justShow = (board, winningNumbers)=>{

    if(winningNumbers!==undefined){
      console.log(winningNumbers);
      for (let number of winningNumbers){
        const space = document.getElementById(number.toString());
        space.setAttribute("class","winningCombo")
      }
    }
    
    
    const div = document.getElementById("divMain");
    div.innerHTML="<table><tr><td class='cell' id='0'>"+board[0]+"</td><td class='cell' id='1'>"+board[1]+"</td><td class='cell' id='2'>"+board[2]+"</td></tr><tr><td class='cell' id='3'>"+board[3]+"</td><td class='cell' id='4'>"+board[4]+"</td><td class='cell' id='5'>"+board[5]+"</td></tr><tr><td class='cell' id='6'>"+board[6]+"</td><td class='cell' id='7'>"+board[7]+"</td><td class='cell' id='8'>"+board[8]+"</td></tr></table>";

  }
  
 //changeName
 
 name:string=null;
 
 hideInput:boolean=false;
 saveName(){
    if(this.name ==null) this.name="NONAME";
    this.hideInput==false?this.hideInput=true:this.hideInput=false;
    this.socket.emit("createPlayer",(this.name));
 }
  
}
