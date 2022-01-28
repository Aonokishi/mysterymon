import React from "react";

function useGesture() {
  const [gestures, setGestures] = React.useState(["center", "center"]);

  const reset = React.useCallback(() => {
    setGestures(["reset", "reset"]);
  }, []);

  React.useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      console.log("no sensor");
      return;
    }

    const handle = (event) => {
      var leftOrRight = event.gamma;
      var upOrDown = event.beta;
      var threshold = 40;

      if (Math.abs(leftOrRight) > Math.abs(upOrDown)) {
        if (Math.abs(leftOrRight) < threshold) {
          setGestures((oldValue) => [oldValue[1], "center"]);

          if (leftOrRight > 0) {
            //color changer
            document.getElementById(1).style.backgroundColor =
              "rgba(88, 78, 193, 0.75)";
            document.getElementById(0).style.backgroundColor =
              "rgba(0, 0, 0, 0.15)";
            document.getElementById(2).style.backgroundColor =
              "rgba(0, 0, 0, 0.15)";
            document.getElementById(3).style.backgroundColor =
              "rgba(0, 0, 0, 0.15)";
          } else {
            document.getElementById(0).style.backgroundColor =
              "rgba(88, 78, 193, 0.75)";
            document.getElementById(1).style.backgroundColor =
              "rgba(0, 0, 0, 0.15)";
            document.getElementById(2).style.backgroundColor =
              "rgba(0, 0, 0, 0.15)";
            document.getElementById(3).style.backgroundColor =
              "rgba(0, 0, 0, 0.15)";
          }
          return;
        }

        if (leftOrRight > 0) {
          console.log("Right");
          setGestures((oldValue) => [oldValue[1], "right"]);
        } else {
          console.log("Left");
          setGestures((oldValue) => [oldValue[1], "left"]);
        }
      } else {
        if (Math.abs(upOrDown) < threshold) {
          setGestures((oldValue) => [oldValue[1], "center"]);
          if (upOrDown > 0) {
            document.getElementById(3).style.backgroundColor =
              "rgba(88, 78, 193, 0.75)";
            document.getElementById(0).style.backgroundColor =
              "rgba(0, 0, 0, 0.15)";
            document.getElementById(2).style.backgroundColor =
              "rgba(0, 0, 0, 0.15)";
            document.getElementById(1).style.backgroundColor =
              "rgba(0, 0, 0, 0.15)";
          } else {
            document.getElementById(2).style.backgroundColor =
              "rgba(88, 78, 193, 0.75)";
            document.getElementById(0).style.backgroundColor =
              "rgba(0, 0, 0, 0.15)";
            document.getElementById(1).style.backgroundColor =
              "rgba(0, 0, 0, 0.15)";
            document.getElementById(3).style.backgroundColor =
              "rgba(0, 0, 0, 0.15)";
          }
          return;
        }

        if (upOrDown > 0) {
          console.log("Down");
          setGestures((oldValue) => [oldValue[1], "down"]);
        } else {
          console.log("UP");
          setGestures((oldValue) => [oldValue[1], "up"]);
        }
      }
    };

    window.addEventListener("deviceorientation", handle, true);

    return () => window.removeEventListener("deviceorientation", handle);
  }, []);

  return { oldGesture: gestures[0], newGesture: gestures[1], reset };
}

export default useGesture;
