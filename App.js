import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";


import firebase from "firebase/app";
import "firebase/messaging";
import {firebase as firebaseInit} from "./firebase/config"
const messaging = firebase.messaging();

messaging.onMessage((payload) => {
  console.log("Message received. ", payload);
  const { title, ...options } = payload.notification;
  navigator.serviceWorker.register("firebase-messaging-sw.js");
  function showNotification() {
    Notification.requestPermission(function (result) {
      if (result === "granted") {
        navigator.serviceWorker.ready.then(function (registration) {
          registration.showNotification(payload.notification.title, {
            body: payload.notification.body,
            tag: payload.notification.tag,
          });
        });
      }
    });
  }
  showNotification();
});

export default function App() {
  const [pushToken, setPushToken] = useState("")
  useEffect(() => {
    let pushToken;
    const messaging = firebase.messaging();
    Notification.requestPermission()
      .then(per => console.log(per))
    messaging
      .getToken()
      .then((currentToken) => {
        if (currentToken) {
          console.log("FCM token> ", currentToken);
          pushToken = currentToken;
          setPushToken(pushToken)
        } else {
          console.log("No Token available");
        }
      })
      .catch((error) => {
        console.log("An error ocurred while retrieving token. ", error);
      });
  }, [])
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={async () => {
          const res = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Yourkey`,
            },
            body: JSON.stringify({
              to: regiToken,
              priority: 'normal',
              data: {
                title: "Yo",
                message: 'Hello world!',
              },
            }),
          })
          const json = res.json()
          console.log(json)
        }}
      >

      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
