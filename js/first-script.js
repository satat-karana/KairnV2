// -- Global Variables --
let stream = null;
const videoElement = document.getElementById("webcam");
const widget = document.getElementById("mirror-widget");

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    videoElement.srcObject = stream;
    console.log("Camera Successfully Started!");
  } catch (error) {
    console.error("Error accessing the camera: ", error);
    alert("Could not access the camera, please check permissions.");
  }
}

function stopCamera() {
  if (videoElement && videoElement.srcObject) {
    const stream = videoElement.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoElement.srcObject = null;
    console.log("Sucessfully ended camera feed!");
  }
}


async function launchWidget() {
  // 1. Check browser support
  if (!("documentPictureInPicture" in window)) {
    alert("Document Picture-in-Picture is not supported.");
    return;
  }

  try {
    // 2. Start the camera if it is not already running
    if (!videoElement.srcObject) {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoElement.srcObject = stream;
    }

    // 3. Open the floating window FIRST
    const pipWindow =
      await window.documentPictureInPicture.requestWindow({
        width: 300,
        height: 220,
      });

    // 4. Copy the stylesheet into the floating window
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      pipWindow.document.head.appendChild(
        link.cloneNode(true)
      );
    });

    // 5. Move the widget into the floating window
    pipWindow.document.body.appendChild(widget);

    // 6. Return the widget when the window closes
    pipWindow.addEventListener("pagehide", () => {
      document.body.appendChild(widget);
    });

  } catch (error) {
    console.error("Error Launching Widget:", error);
  }
}
