<template>
    <ion-app>
      <ion-menu content-id="main-content" side="start" menu-id="main-menu">
        <ion-content>
          <ion-list>
            <ion-item v-for="item in menuItems" :key="item">
              <ion-icon :name="'logo-' + item"></ion-icon>
              <ion-label>{{ item }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
  
      <ion-content id="main-content">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-menu-button menu="main-menu"></ion-menu-button>
            </ion-buttons>
            <ion-title>Ionic Menu</ion-title>
          </ion-toolbar>
        </ion-header>
        <!-- Adicione seu conteúdo aqui -->
      </ion-content>
    </ion-app>
  </template>
  
  <script>
  import { IonMenu, IonContent, IonList, IonItem, IonIcon, IonLabel, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from '@ionic/vue';
  
  export default {
    name: 'NavBar',
    components: {
      IonMenu,
      IonContent,
      IonList,
      IonItem,
      IonIcon,
      IonLabel,
      IonHeader,
      IonToolbar,
      IonButtons,
      IonMenuButton,
      IonTitle
    },
    data() {
      return {
        menuItems: ['home', 'wifi', 'settings', 'options', 'search', 'cloud', 'stopwatch', 'apps', 'map', 'locate', 'compass', 'create', 'call']
      };
    }
  };
  </script>
  
  <style scoped>
  ion-content {
    --background: #3A3A4F;
  }
  
  ion-item {
    color: #FFFFFF;
  }
  
  /* Adapte suas animações e efeitos aqui */
  </style>