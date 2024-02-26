<template>
  <div id="open-modal" class="modal-window">
    <div>
        <i class="fa-solid fa-check" style="color: #fff;"></i>
    </div>
  </div>
</template>

<style scoped>
    .modal-window {
	 position: fixed;
	 top: 0;
	 right: 0;
	 bottom: 0;
	 left: 0;
	 z-index: 999;
	 pointer-events: none;
	 transition: all 0.3s;
}
 .modal-window:target {
	 visibility: visible;
	 opacity: 1;
	 pointer-events: auto;
}
 .modal-window > div {
	 width: 37px;
	 position: absolute;
	 top: 95%;
	 left: 98%;
	 transform: translate(-50%, -50%);
	 padding: 0.7em;
	 background: rgb(37 157 26 );
}
 .modal-window header {
	 font-weight: bold;
}
 .modal-window h1 {
	 font-size: 150%;
	 margin: 0 0 15px;
}
 .modal-close {
	 color: #aaa;
	 line-height: 50px;
	 font-size: 80%;
	 position: absolute;
	 right: 0;
	 text-align: center;
	 top: 0;
	 width: 70px;
	 text-decoration: none;
}
 .modal-close:hover {
	 color: black;
}
 .container {
	 display: grid;
	 justify-content: center;
	 align-items: center;
	 height: 100vh;
}
 .modal-window > div {
	 border-radius: 5px;
}
 .modal-window div:not(:last-of-type) {
	 margin-bottom: 15px;
}
 .logo {
	 max-width: 150px;
	 display: block;
}
 small {
	 color: lightgray;
}
 .btn {
	 background-color: white;
	 padding: 1em 1.5em;
	 border-radius: 0.5rem;
	 text-decoration: none;
}
 .btn i {
	 padding-right: 0.3em;
}
 
</style>