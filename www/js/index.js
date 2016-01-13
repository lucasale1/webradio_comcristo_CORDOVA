/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var playing;
var audio;
var volume;
var mute;


function loadInfo(){
    var head= document.getElementsByTagName('body')[0];
    var script= document.createElement('script');
    script.type= 'text/javascript';
    script.src= 'https://centova.logicahost.com.br:2199/system/streaminfo.js';
    script.id='scriptInfo';or
    head.appendChild(script);
 }		

function statusChange(status){    	
	//if(audio.MEDIA_PAUSED == status || audio.MEDIA_STOPPED == status ||
		//audio.MEDIA_NONE == status){
	console.log("status: "+status);	
	if(status == 3 || status == 4 || status == 0){			
		$('#playPause').attr('src','img/play.png');
		playing = false;
		if(status == 4){
			if(app.connected()){
				audio  = new Media("http://up-gc2.webnow.com.br/radiorockweb128.mp3",null,onError,statusChange);
				app.play();
			}
			else{
				window.alert('Por favor, verifique sua conexão com a internet.');
			}
		}
	}
	//else if(audio.MEDIA_RUNNING == status || audio.MEDIA_STARTING == status){
	else if(status == 2 || status == 1){
		$('#playPause').attr('src', "img/pause.png");
		playing = true;
		if(status == 1){
			$('#carregando').text("Carregando...");
		}
		else{
			$('#carregando').text("");
		}
	}
}

function onError(error){
	window.alert('Erro! Verifique sua conexão com a internet e tente novamente');
	//navigator.app.exitApp();
}
var app = {
    // Application Constructor
    initialize: function() {    	
        this.bindEvents();        
        playing = false;
        volume = 0.5;
        mute=false;
    },
    
    connected: function(){
    	var networkState = navigator.connection.type;    	        
        if(networkState == Connection.UNKNOWN ||
        		networkState == Connection.NONE){
        	return false;
        }
        return true;
        
    },
       
    
    play: function(){
    	/*if(typeof(playing) == 'undefined' && playing == null){
    		playing = false;
    	}*/    	
    	if(!playing){
    		if(!app.connected()){
				window.alert("Por favor, verifique sua conexão com a internet.");	
			}
			else{
				if(!$('#scriptInfo').length){
					loadInfo();
				}
	    		audio.play();
	    		playing = true;
			}
    		
    	}
    	else{    		
    		audio.pause();
    		playing = false;
    	}
    },    
    
    
    atualizaSlider: function(){    	
    	var slider = $('#volume');
    	slider.val(volume*100);
    },
    
    atualizaVolume: function(){
    	//var audio = $('#audioPlayer')[0];
    	var slider = $('#volume');
    	audio.setVolume(slider.val()/100.0);
    	if(mute)app.mute();
    }, 
    
    volumeUp: function(){
    	//var audio = $('#audioPlayer')[0];
    	volume+=(volume>=1?0:0.1);
    	audio.setVolume(volume);
    	app.atualizaSlider();
    },
    volumeDown: function(){    	
    	volume+=(volume<=0?0:-0.1);
    	audio.setVolume(volume);
    	app.atualizaSlider();
    },
    
    mute: function(){
    	if(!mute){
    		mute = true;
    		audio.setVolume(0);
    		$('#mute').attr('src','img/mute.png');
    	}
    	else{
    		mute = false;
    		audio.setVolume(volume);
    		$('#mute').attr('src','img/mute_off.png');
    	}
    },    
    
    bindEvents: function() {
    	document.addEventListener('deviceready', function () {
    		  if (navigator.notification) { // Override default HTML alert with native dialog
    		      window.alert = function (message) {
    		          navigator.notification.alert(
    		              message,    // message
    		              null,       // callback
    		              "CCNAWEBRADIO", // title
    		              'OK'        // buttonName
    		          );
    		      };    		  
    		  }
    		  
    		  //audio = new Media("http://centova.logicahost.com.br:8285/;stream.nsv&type=mp3",null,onError,statusChange);
    		  //audio = new Media("http://centova.logicahost.com.br:2199/tunein/radio42.qtl",null,onError,statusChange);
    		  //audio = new Media("http://centova.logicahost.com.br:2199/tunein/radio42.ram",null,onError,statusChange);
    		  //audio = new Media("https://centova.logicahost.com.br:2199/tunein/radio42.asx",null,onError,statusChange);
    		  //audio = new Media("http://centova.logicahost.com.br:2199/tunein/radio42.pls",null,onError,statusChange);
    		  //audio  = new Media("http://192.157.253.55/players/8285-VQmspKaG.m3u",null,onError,statusChange);
    		  audio  = new Media("rtsp://192.157.253.55:1935/shoutcast/8285-JCPgWvn.stream",null,onError,statusChange);
    		  //audio  = new Media("http://174.36.42.99:8285/stream",null,onError,statusChange);
    		  //audio = new Media("http://192.168.0.15:8000/stream2ip.mp3",null,onError,statusChange);
    		  app.volumeUp();
    		}, false);
    	$('#playPause').on('click',app.play);
    	$('#volumeUp').on('click',app.volumeUp);
    	$('#volumeDown').on('click',app.volumeDown);
    	$('#volume').on('input',app.atualizaVolume);
    	$('#mute').on('click',app.mute);
    	//audio.onplay=app.trocaImagem;
    	//audio.onpause=app.trocaImagem;
    },
    
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        console.log('Received Event: ' + id);
    }    
    
};

app.initialize();
//
