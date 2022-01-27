import React from "react";
import lodash from "lodash";

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

    const throttled = lodash.debounce(handle, 1000, { maxWait: 2000 });

    window.addEventListener("deviceorientation", throttled, true);

    return () => window.removeEventListener("deviceorientation", throttled);
  }, []);

  return { oldGesture: gestures[0], newGesture: gestures[1], reset };
}

export default useGesture;
