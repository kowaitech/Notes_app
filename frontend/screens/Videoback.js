// import { View, StyleSheet } from "react-native";
// import { Video } from "expo-av";

// export default function VideoScreen({children}) {
//   return (
//     <View style={styles.container}>
//       <Video
//         source={require("../assets/videos/bgvideo.mp4")}
//         style={styles.video}
//         resizeMode="contain"
//         isMuted  
//         isLooping
//         shouldPlay
//       />
//       {children}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   video: {
//     width: "100%",
//     height: "100%",
//   },
// });


import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";

export default function VideoScreen({ children }) {
  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        source={require("../assets/videos/bgvideo.mp4")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"   
        isMuted
        isLooping
        shouldPlay
      />

      {/* Overlay content */}
      <View style={styles.overlay}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
});
