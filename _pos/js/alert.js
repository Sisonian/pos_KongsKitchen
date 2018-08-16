    function Toast(bgColor, textColor){
        this.bgColor = bgColor == null ? 'black' : bgColor;
        this.textColor = textColor == null ? '#DDD' : textColor;
        this.toastTime = 0;
        this.id = null;

        // document.head.style.innerText += 'Akash';
        this.show = function(msg, action){
          if (action == 'success') {
            this.bgColor = '#44bd32';
          }
          if (action == 'failed') {
            this.bgColor = '#c23616';
          }
          if(_(this.id) && _(this.id).style.display != "none"){
              clearTimeout(this.toastTime);
          }
          if(!(_(this.id))){
              var div = document.createElement("div");
              if(_("toast_div") !== null){
                this.id = 'toast_div' + document.querySelectorAll('#toast_div').length;
              }else{
                this.id = 'toast_div';
              }
            
              div.setAttribute("id", this.id);  
              div.style.minWidth = "5em";
              div.style.backgroundColor = this.bgColor;
              div.style.borderRadius = "3px";
              div.style.position = "fixed";
              div.style.bottom = "90%";
              div.style.right = "3%";
              div.style.padding = "1em";
              div.style.zIndex= "99";
              div.style.webkitAnimation= "popup 0.2s ease";
              div.style.animation= "popup 0.2s ease";
              var p = document.createElement("p");
              p.style.color = this.textColor;
              p.style.width = "100%";
              p.style.margin = "0%";
              p.style.display = "inline";
              p.style.fontFamily = "Arial";
              div.style.boxShadow = "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)";
              var text = document.createTextNode(msg);
              p.appendChild(text);
              div.appendChild(p);
              document.body.appendChild(div);
              div.style.transition = "all 0.2s ease-in";
          }else{
              if(_(this.id).style.display != "none"){
                  _(this.id).style.display = "none";
              }
              _(this.id).firstElementChild.innerHTML = msg;
          }
          _(this.id).style.display = "block";
          this.toastTime = setTimeout(function(){
              _(this.id).style.display = "none";
          }.bind(this), 5000);
        }

        function _(key){
          return document.getElementById(key);
        }
        
        if(_('toast_popup_animation') == null){
          var style = document.createElement('style');
          style.type = 'text/css';
          style.id = 'toast_popup_animation'; 
          style.textContent= '@-webkit-keyframes popup{ from { transform: scale(0); } to { transform: scale(1);} }' +
                            '@keyframes popup{ from { transform: scale(0); } to { transform: scale(1);} }';
          document.getElementsByTagName('head')[0].appendChild(style);  
        }
    }
    var toast = new Toast();