/*
                            ████                              
                          ██░░░░██                            
                        ██░░░░░░░░██                          
                        ██░░░░░░░░██                          
                      ██░░░░░░░░░░░░██                        
                      ██░░░░░░░░░░░░██                        
                      ██░░░░░░░░░░░░██                        
                        ██░░░░░░░░██                          
                          ████████ 

          code stolen from all favorite stackoverflow
          art stolen from https://textart.sh/topic/egg
*/
// a key map of allowed keys
var allowedKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  65: 'a',
  66: 'b'
};

// the 'official' Konami Code sequence
var konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

// a variable to remember the 'position' the user has reached so far.
var konamiCodePosition = 0;

// add keydown event listener
document.addEventListener('keydown', function(e) {
  // get the value of the key code from the key map
  var key = allowedKeys[e.keyCode];
  // get the value of the required key from the konami code
  var requiredKey = konamiCode[konamiCodePosition];

  // compare the key with the required key
  if (key == requiredKey) {

    // move to the next key in the konami code sequence
    konamiCodePosition++;

    // if the last key is reached, activate cheats
    if (konamiCodePosition == konamiCode.length) {
      activateCheats();
      konamiCodePosition = 0;
    }
  } else {
    konamiCodePosition = 0;
  }
});
var cheats_activated = false;
function activateCheats() {
  
  if(cheats_activated)
  {
    location.reload();
    return;
  }else if(!confirm("Do you really want to do this to yourself?")){
    return;
  }

  cheats_activated = true;
  document.getElementById("background").classList.add("scrolling-bg");
  bg_party_mode = 6;
  //alert("Party mode activated!");
  var rythm = new Rythm()
  rythm.setMusic('/ratmass.mp3')

  rythm.addRythm('neon2', 'neon', 5, 10, {
    from: [0,0,255],
    to:[255,0,255]
  })

  rythm.addRythm('borderColor2', 'borderColor', 0, 10, {
    from: [0,0,255],
    to:[255,0,255]
  })


  rythm.addRythm('borderEffect1', 'borderWidth', 0, 2, {
    min: 10,
    max: 20
  })

  rythm.addRythm('swing4', 'jump', 150, 20, {
    min: -20,
    max: 20
  })




            rythm.addRythm('spicyGlowingTitle', 'kern', 0, 10 , {
              min: -5,
              max: 5
            })
          
            rythm.addRythm('kern1', 'kern', 0, 10 , {
              min: -5,
              max: 15
            })

            rythm.addRythm('kern2', 'kern', 0, 30 , {
              min: -2,
              max: 2,
            })

            rythm.addRythm('kern2', 'neon', 0, 10, {
              from: [0,0,255],
              to:[255,0,255]
            })
          

  rythm.start()
}