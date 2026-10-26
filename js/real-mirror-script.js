let stream = null;
let videoElement = null;
let widget = null;    // back side (#widget-video)
let greeting = null;  // front side (#widget-greeting)

document.addEventListener("DOMContentLoaded", () => {
  videoElement = document.getElementById("webcam");
  widget = document.getElementById("widget-video");
  greeting = document.getElementById("widget-greeting");

  // finds the button that's already inside #widget-video, no new id needed
  widget.querySelector("button").addEventListener("click", stopCamera);
});

function showVideo() {
  greeting.classList.add("hidden");
  widget.classList.remove("hidden");
}

function showGreeting() {
  widget.classList.add("hidden");
  greeting.classList.remove("hidden");
}

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    videoElement.srcObject = stream;
    showVideo();
  } catch (error) {
    console.error("Error accessing the camera: ", error);
    alert("Could not access the camera, please check permissions.");
  }
}

function stopCamera() {
  if (videoElement.srcObject) {
    videoElement.srcObject.getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null;
  }
  stream = null;
  // close the pop-out window if it's open
  window.documentPictureInPicture?.window?.close();
  showGreeting();
}

async function launchWidget() {
  if (!("documentPictureInPicture" in window)) {
    alert("Document Picture-in-Picture is not supported.");
    return;
  }

  let pipWindow = null;
  try {
    // Open the window FIRST (your comment said this, but the code did the camera first).
    // requestWindow needs the click's user activation, which the
    // camera permission prompt can use up.
    pipWindow = await window.documentPictureInPicture.requestWindow({
      width: 300,
      height: 220,
    });

    // Copy stylesheets using absolute URLs so relative paths can't break
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const copy = pipWindow.document.createElement("link");
      copy.rel = "stylesheet";
      copy.href = link.href;
      pipWindow.document.head.appendChild(copy);
    });

    // Start the camera if it isn't already running
    if (!videoElement.srcObject) {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      videoElement.srcObject = stream;
    }

    // Move the widget in, and make sure it's actually visible
    pipWindow.document.body.appendChild(widget);
    widget.classList.remove("hidden");
    videoElement.play().catch(() => {});

    // Put it back when the window closes
    pipWindow.addEventListener("pagehide", () => {
      document.getElementById("camera-widget").appendChild(widget);
      if (videoElement.srcObject) showVideo();
      else showGreeting();
    });
  } catch (error) {
    console.error("Error Launching Widget:", error);
    if (pipWindow) pipWindow.close();
  }
}