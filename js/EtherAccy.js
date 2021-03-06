const EtherAccy = function() {

  function setBalance(value) {
    let balance = parseInt(value)/Math.pow(10,18);
    $('body > div > div > div > div.header > div:nth-child(1) > div > div.meta.float-right.text-center > h5:nth-child(2) > span').text(balance);
  }  
  
  function getBalance() {
    setInterval(function() {       
      contractFunctions.getBalance(setBalance);  
    },5000);  
  }  
  
  function setLastBet(val) {
    let value = parseInt(val)/1e18;
    $('#lastBet').text(value.toString() + " ETH");
  } 
  
  function getLastBetLogic(hash) {
   contractFunctions.getLastBet(hash,setLastBet); 
  }  
  
  function getLastBet() {
    setInterval(function() {       
      contractFunctions.getGameHash(getLastBetLogic);  
    },5000);  
  }  
  
  function create() {
    let ante = $('body > div > div > div > div.row.tp > div > div > div:nth-child(2) > input').val();
    let deadline = parseInt(parseFloat($('body > div > div > div > div.row.tp > div > div > div:nth-child(3) > input').val())*60*60);
    let betWindow = parseInt(parseFloat($('body > div > div > div > div.row.tp > div > div > div:nth-child(4) > input').val())*60*60);
    contractFunctions.create(ante,deadline,betWindow);
  }  
  
  function deposit() {
    let value = $('body > div > div > div > div.row.tp > div:nth-child(1) > div > div > input').val();    
    contractFunctions.deposit(value);
  }

  function withdraw() {
    let value = $('body > div > div > div > div.row.tp > div:nth-child(2) > div > div > input').val();  
    contractFunctions.withdraw(value);
  }
  
  function joinTable() {
    contractFunctions.joinTable();
  }
  
 function withdrawAnte() {
    contractFunctions.withdrawAnte();
 }
  
 function adminWithdrawal() {
    contractFunctions.adminWithdrawal();
 }
  
  function countDown(time,id) {
    var countDownDate = time*1000;
        
    var x = setInterval(function() {
      
    var now = Date.now();
          
    var distance = countDownDate - now;
    
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    $(id).html(days + 'd ' + hours + 'h '
    + minutes + 'm ' + seconds + 's ');
    
    if (distance < 0) {
        $(id).html('EXPIRED');
    }
}, 1000);  
  }  
    
  function setPotSize(arr) {
    $('#potAmount').text(parseInt(arr[0])/Math.pow(10,18));   
  }  
  
  function getStartTime(arr) {
    let order = JSON.parse(decodeURI(localStorage.getItem("order"))); 
    let deadline = parseInt(order['deadline']);
    countDown(parseInt(arr[5]) + deadline,'#timeFrame');  
  }  
  
  function getNumberOfCardsDealt(arr) {
    $('#numberOfCardsDealt').text(arr[3])
  }
  
  function getAnte(arr) {
    $('#minBet').text((parseFloat(arr[1])/1e18).toString() + " ETH")
  }
  
  function setBetWindow(val) {
    $('#betWindow').text((parseInt(val)/(60)).toString() + " mins" )     
  }    
  
  function getBetWindowLogic(hash) {
    contractFunctions.getBetWindow(hash,setBetWindow);    
  }  
  
  function getBetWindow(hash) {
    contractFunctions.getGameHash(getBetWindowLogic);
  }

  function getGameBalance(arr) {
    $('#gameBalance').text(arr[0])
  }
  
  function userIsInPlayerList() {
    let playerList = localStorage.getItem("playerList").split(",");
    let user = localStorage.getItem("userAddress");
    for(let i in playerList) {
      if(playerList[i] === user) {
        return true;
      }
    }
    return false;
  }  
  
   function setCurrentPlayer(arr) { 
      let gameState = localStorage.getItem("gameState");
      let roundState = localStorage.getItem("roundState");
      if(gameState === "GAME_LIVE") {
        let currentPlayer = arr[6];
        let currentPlayerText = arr[6] !== "0x0000000000000000000000000000000000000000" ? arr[6] : "WAITING_FOR_FIRST_BETTOR";
        $('#currentPlayer').text(currentPlayerText);
        let query = "[data-content='" + currentPlayer + "']"; 
        let userAddress = localStorage.getItem("userAddress");
        $('#mainGamePage').show();
        if(userIsInPlayerList()) { 
          if(currentPlayer === userAddress || currentPlayer === "0x0000000000000000000000000000000000000000") {
              $('#mainGamePage').hide();
              $('#bettorPage').show();
              $('#bettorPage > ul').show();           
              $('#placeBet').show();
              if(roundState === "NEXT_PLAYER") {
                returnToDefaultCards(); 
                $('#getInitialCards').show();                         
              }
          }  
        }  
        if(currentPlayer !== userAddress && currentPlayer !== "0x0000000000000000000000000000000000000000") {
            $('#getInitialCards').hide();                         
            $('#bettorPage').hide(); 
            $('#mainGamePage').show();          
            $('#mainGamePage > ul').show();         
        }  
        if($(query).attr('data-content') === currentPlayer) {      
          let currentPlayerNumber =  parseInt($(query).text().replace("Player ",""));
          let elementWidth = parseInt($('#mainGamePage > div > ul > li:nth-child(1)').outerWidth());            
          let scaledWidth = (elementWidth)*(currentPlayerNumber-1);       
          let paddingLeft = 35 + scaledWidth;        
          $('#mainGamePage > div > div').css('padding-left', paddingLeft.toString() + "px"); 
        }
      }  
  }   
  
  function getCurrentPlayer() {
    setInterval(function() {     
      contractFunctions.getGameHash(contractFunctions.getCurrentPlayer,[setCurrentPlayer]);
    },5000);          
  } 
  
  function getStructElements() {
    setInterval(function() {   
      contractFunctions.getGameHash(contractFunctions.getGameStruct,[setPotSize,getStartTime,getAnte,setCurrentPlayer]);
    },5000);        
  }  

  function setPlayerList(arr) {
    localStorage.setItem("playerList",arr);
    for(i=0;i<arr.length;i++) {
      let playerElement = '#player' + (i+1).toString() + '> a';
      $(playerElement).attr("data-content",arr[i]);      
    }  
  }
  
  function getPlayerList() {
    setInterval(function() {   
      contractFunctions.getGameHash(contractFunctions.getPlayerList,setPlayerList);    
    },5000);  
  }   
    
  function redirectPlayerToGamePage() {
      let playerList = localStorage.getItem("playerList").split(",");
      let user = localStorage.getItem("userAddress");
      for(let i in playerList) {
        if(playerList[i] === user) {
          $('#mainGamePage').hide();
          if($('#bettorPage').css('display') === 'none') {
            $('#bettorPage').show();
            $('#bettorPage > ul').hide();
          }  
          return;
        }
      }
  }   

  function selectMinBet() {
    $('#bettorPage > div > ul > div.col-lg-9 > li.min > h5 > span').addClass('selectedBox');
    $('#bettorPage > div > ul > div.col-lg-9 > li.max > h5 > span').removeClass('selectedBox');
    $('#bettorPage > div > ul > div.col-lg-9 > li.cus > h5 > span').css('border-color','#afafaf');  
    localStorage.setItem("betChoice","minBet");
  }  
  
  function selectMaxBet() {
    $('#bettorPage > div > ul > div.col-lg-9 > li.max > h5 > span').addClass('selectedBox');
    $('#bettorPage > div > ul > div.col-lg-9 > li.min > h5 > span').removeClass('selectedBox');
    $('#bettorPage > div > ul > div.col-lg-9 > li.cus > h5 > span').css('border-color','#afafaf'); 
    localStorage.setItem("betChoice","maxBet");   
  }
  
  function selectCustomBet() {
    $('#bettorPage > div > ul > div.col-lg-9 > li.min > h5 > span').removeClass('selectedBox');  
    $('#bettorPage > div > ul > div.col-lg-9 > li.max > h5 > span').removeClass('selectedBox');    
    $('#bettorPage > div > ul > div.col-lg-9 > li.cus > h5 > span').css('border-color','black'); 
    localStorage.setItem("betChoice","customBet");    
  }  
  
  function getStandardCardValue(val) {
    return (val % 13) + 1;
  }  
  
  function getCardValue(val,type) {
    let value = getStandardCardValue(val) == 1 ? 14 : getStandardCardValue(val);
    return value; 
  }  
  
  function returnToDefaultCards() {
    $('#bettorPage > ul > div > li:nth-child(1) > div.n > h4').text("?");
    $('#bettorPage > ul > div > li:nth-child(1) > div.s > img').attr('src',"");  
    $('#bettorPage > ul > div > li:nth-child(2) > div.n > h4').text("?");
    $('#bettorPage > ul > div > li:nth-child(2) > div.s > img').attr('src',"");    
    $('#bettorPage > ul > div > li:nth-child(3) > div.n > h4').text("?");
    $('#bettorPage > ul > div > li:nth-child(3) > div.s > img').attr('src',"");     
  } 
  
  function displayCard(val,type) {
    let cardValue = type === 1 ? getCardValue(val) : getStandardCardValue(val);
    let cardType = (parseInt(Math.random()*(1e16)) % 4) + 1;
    if(type === 0) {
      $('#bettorPage > ul > div > li:nth-child(1) > div.n > h4').text(cardValue);
      $('#bettorPage > ul > div > li:nth-child(1) > div.s > img').attr('src',"img/" + cardType + ".png");      
      $('#mainGamePage > ul > div > li:nth-child(1) > div.n > h4').text(cardValue);
      $('#mainGamePage > ul > div > li:nth-child(1) > div.s > img').attr('src',"img/" + cardType + ".png");  
    }
    else if(type === 1) {
      $('#bettorPage > ul > div > li:nth-child(3) > div.n > h4').text(cardValue);
      $('#bettorPage > ul > div > li:nth-child(3) > div.s > img').attr('src',"img/" + cardType + ".png"); 
      $('#mainGamePage > ul > div > li:nth-child(3) > div.n > h4').text(cardValue);
      $('#mainGamePage > ul > div > li:nth-child(3) > div.s > img').attr('src',"img/" + cardType + ".png");      
    }
    else if(type === 2) {
      $('#bettorPage > ul > div > li:nth-child(2) > div.n > h4').text(cardValue);
      $('#bettorPage > ul > div > li:nth-child(2) > div.s > img').attr('src',"img/" + cardType + ".png");
      $('#mainGamePage > ul > div > li:nth-child(2) > div.n > h4').text(cardValue);
      $('#mainGamePage > ul > div > li:nth-child(2) > div.s > img').attr('src',"img/" + cardType + ".png");     
    }    
  }  

  function checkForThirdCardLogic(arr) {
    console.log(parseInt(arr[0]));
    console.log(parseInt(arr[1]));
    console.log(parseInt(arr[2]));
    if(parseInt(arr[2]) !== 0) { 
      displayCard(arr[0],0);
      displayCard(arr[1],1);      
      displayCard(arr[2],2); 
    }
    else if(parseInt(arr[1]) > 0 && parseInt(arr[0]) > 0) {
      displayCard(arr[0],0);
      displayCard(arr[1],1);
      $('#bettorPage > ul > div > li:nth-child(2) > div.n > h4').text("?");
    }  
  }    
  
  function logUserHand(arr) {
    checkForThirdCardLogic(arr);  
  }  
  
  function getCurrentUserHand(hash,arr) {
    let user = arr[6];
    let currentUser = arr[6];
    if(localStorage.getItem("roundState") !== "DEALING_CARDS") {
      let playerList = localStorage.getItem("playerList").split(",");      
      currentUser = playerList[playerList.indexOf(user) - 1];
      console.log(arr[6],playerList,playerList.indexOf(user),currentUser);
    }  
    contractFunctions.getUserHand(hash,currentUser,logUserHand);
  }  
  
  function getGameStructWrapper(hash) {
    contractFunctions.getGameStruct(hash,getCurrentUserHand);    
  }  
  
  function getCurrentUserCards() {
      contractFunctions.getGameHash(getGameStructWrapper);
  }  
  
  function getInitialCards() {
    contractFunctions.getInitialCards();        
  }  
  
  function placeBet() {
    let betChoice = localStorage.getItem("betChoice");
    localStorage.removeItem("betChoice");   
    let betValue;
    if(betChoice === "minBet") {
      betValue = (parseFloat($('#minBet').text().replace(" ETH",""))*1e18);
    }  
    else if(betChoice === "maxBet") {
      betValue = (parseFloat($('#potAmount').text().replace(" ETH",""))*1e18);
    }  
    else if(betChoice === "customBet") {
      betValue = (parseFloat($('#bettorPage > div > ul > div.col-lg-9 > li.cus > h5 > span > input').val())*1e18);
    }
    console.log(betValue);
    contractFunctions.bet(betValue);
  }  
 
  function setGameState(state) {
    state = parseInt(state)
    console.log(state);
    let game_state = "";
    if(state === 0) {
      game_state = "NONE"; 
      localStorage.setItem("roundState","NONE");      
    }      
    if(state === 1) {
      game_state = "NEXT_PLAYER"; 
      localStorage.setItem("roundState","NEXT_PLAYER");      
    }    
    else if(state === 2) {
      game_state = "DEALING_CARDS";
      localStorage.setItem("roundState","DEALING_CARDS");
    }  
    else if(state === 3) {
      game_state = "CARDS_DEALT";
      localStorage.setItem("roundState","CARDS_DEALT");      
    }  
    else if(state === 4) {
      game_state = "INVALID"; 
      localStorage.setItem("roundState","INVALID");      
    }
    $('#roundState').text(game_state);
  }    
  
  function getGameState() {
    setInterval(function(){
      contractFunctions.getGameState(setGameState);
    },5000);
  }

  function checkState() {
    setInterval(function(){
      let gameState = localStorage.getItem("gameState");
      if(gameState === "NONE") {
        $('#mainGamePage').hide();
        $('#bettorPage').hide();
        $('#enterGame').hide();
        $('#mainGamePage > div > div').hide();            
      }
      else if(gameState=== "WAITING_FOR_PLAYERS") {
        $('#mainGamePage').show();
        $('#mainGamePage > ul').hide();
        $('#enterGame').show();
        $('#bettorPage').hide();
        $('#mainGamePage > div > div').hide();                    
      }
      else if(gameState === "GAME_LIVE") {
        $('#enterGame').hide();
        $('#mainGamePage > div > div').show();   
        $('#bettorPage > ul').show();     
        $('#mainGamePage > ul').show();     
      }
      else if(gameState === "GAME_CANCELLED") {
        $('#mainGamePage').show();
        $('#mainGamePage > ul').hide();
        $('#withdrawAnte').show();
        $('#enterGame').hide();
        $('#bettorPage').hide();
        $('#mainGamePage > div > div').hide();                    
      }  
      else if(gameState === "GAME_FINISHED") {
        $('#mainGamePage').show();
        $('#bettorPage').hide();
        $('#enterGame').hide();
        $('#mainGamePage > div > div').hide();                    
      }      
    },5000);
  }

  function setState(state) {
    state = parseInt(state)
    let game_state = "";
    if(state === 0) {
      game_state = "NONE";
      localStorage.setItem("gameState","NONE");
    }    
    else if(state === 1) {
      game_state = "WAITING_FOR_PLAYERS";
      localStorage.setItem("gameState","WAITING_FOR_PLAYERS");      
    }  
    else if(state === 2) {
      game_state = "GAME_LIVE";
      localStorage.setItem("gameState","GAME_LIVE");            
    }
    else if(state === 3) {
      game_state = "GAME_CANCELLED"; 
      localStorage.setItem("gameState","GAME_CANCELLED");                  
    }      
    else if(state === 4) {
      game_state = "GAME_FINISHED"; 
      localStorage.setItem("gameState","GAME_FINISHED");                        
    }     
    else if(state === 5) {
      game_state = "INVALID"; 
      localStorage.setItem("gameState","INVALID");                              
    }         
    $('#gameState').text(game_state); 
  }
 
  function getState() {
    setInterval(function(){
      contractFunctions.getState(setState);
    },5000);
  }

  function init() {
    getBalance();  
    if(window.location.href === "https://etheraccy.github.io/depositWithdraw.html") {
      $('body > div > div > div > div.row.tp > div:nth-child(1) > div > center > button').on('click',deposit);
      $('body > div > div > div > div.row.tp > div:nth-child(2) > div > center > button').on('click',withdraw);  
    }  
    if(window.location.href === "https://etheraccy.github.io/index.html" || window.location.href === "https://etheraccy.github.io/") {
      $('body > div > div > div > div.row.tp > div > div > center > button').on('click',create);      
    }
    if(~window.location.href.indexOf("https://etheraccy.github.io/gamePage.html")) {
      $('[data-toggle="popover"]').popover();            
      $('#withdrawAnte').on('click',withdrawAnte);
      $('#enterGame').on('click',joinTable); 
      $('#adminWithdrawal').on('click',adminWithdrawal);
      $('#bettorPage > div > ul > div.col-lg-9 > li.min > h5 > span').on('click',selectMinBet);
      $('#bettorPage > div > ul > div.col-lg-9 > li.max > h5 > span').on('click',selectMaxBet);
      $('#bettorPage > div > ul > div.col-lg-9 > li.cus > h5 > span > input').on('click',selectCustomBet);
      $('#getInitialCards').on('click',getInitialCards);
      $('#placeBet').on('click',placeBet);
      getCurrentUserCards();
      getStructElements();
      getState();
      getGameState();        
      getCurrentPlayer();
      checkState();
      getLastBet();
      getPlayerList();
    }
  
  }
  
  return {
    init
  };
  
}();  
