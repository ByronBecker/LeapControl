
import * as Leap from 'leapjs';

export let initLeap = (cb) => {
    
    let controllerOptions = {} //not sure if this is just needed as a param for the Leap.loop?

    let leapOutputData = {}

    let fingerTypeToString = (type: number): string => {
        switch(type) {
            case 0:
                return "thumb"
            case 1:
                return "index"
            case 2:
                return "middle"
            case 3:
                return "ring"
            case 4:
                return "pinky"
            default:
                throw Error ("unsupported finger number input")
        }
    }

    let updateFingerData = (handType:string, finger) => {
        let tipPosition = finger.tipPosition;
        let key = handType + '.' + fingerTypeToString(finger.type)

        leapOutputData[key + '.x'] = tipPosition[0] 
        leapOutputData[key + '.y'] = tipPosition[1] 
        leapOutputData[key + '.z'] = tipPosition[2] 


    }

    Leap.loop(controllerOptions, (frame) => {
        //console.log("frame", frame)

        frame.hands.forEach( hand => {
            hand.fingers.forEach( finger => {
                //console.log("finger", finger, finger.type, "on hand", hand.type);
                updateFingerData(hand.type, finger)
            })
            
            
        });

        console.log("updated finger data is", leapOutputData)
        cb(leapOutputData);
    })
    
}