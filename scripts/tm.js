
var init = function()
{
    for (var i = 0; i < 5; i++) {
     
            tape[i] = 0;
    }

    tape[0] = 1;

    var myVar = setInterval(function () { tm(); }, 60);
};

var tm = function () {

    // The position table stores the position of the Turing machine on the tape,
    // where var i represents multiple Turing machines operating on the same tape
    var bit = tape[position];
    switch (turingMachines) {
        // State A is the ready state, it holds no memory of erasing a bit. This is the "ZERO STATE".
        case "A":
            if (bit == 0) {
                // Advance until a bit 1 is found
                position++;
                turingMachines = "A";
            }
            else if (bit == 1) {
                // Erase the bit from the tape and store it in memory as state B  
                tape[position] = 0;
                turingMachines = "B";
            }
            break;
        case "B":
            if (bit == 0) {
                // Advance until a bit 1 is found
                position++;
                turingMachines = "C";
            }
            else if (bit == 1) {
                // If a bit in state B is equal to 1, it is because the machine 
                // just wrote it to the tape
                position++;
                turingMachines = "A";
            }
            break;
        case "C":
            if (bit == 0) {
                // A bit 1 is held in memory, switch to B state and continue oscillating
                // until colliding with bit 1
                turingMachines = "B";
            }
            else if (bit == 1) {
                // A bit 1 has been found and cannot be erased because a bit is already 
                // in memory, move back one space and switch to the D state
                position--;
                turingMachines = "D";
            }
            break;
        case "D":
            if (bit == 0) {
                // Release the bit from memory and write it back to the tape, 
                // revert to state B
                tape[position] = 1;
                turingMachines = "B";
                bitsPushed = bitsPushed + 1;
            }
            else if (bit == 1) {
                // This state is rare and happens when another Turing machine has released 
                // a bit in a parallel operation, revert to state C
                turingMachines = "C";
            }
            break;
        default:
            break;
    }

    if (position < 0) {
        position = (position < 0 ? (tape.length - 1) : position);
    }
    else {
        position = (position >= tape.Length ? position % tape.Length : position);
    }

    var bitLocations = [];

    for (var i = 0; i < tape.length; i++) {
        if (tape[i] == 1) {
            bitLocations.push(i / (tape.length - 1));
        }
    }

    var rad = (bitLocations[0] * 2) - 1;


    link.attr("d", function (d) {
        
        return "M" + (d[0].x) + "," + (d[0].y)
            + "S" + (d[1].x) + "," + (d[1].y)
            + " " + (d[2].x) + "," + d[2].y;
    });

    node.attr("transform", function (d) {
            d.x = d.x + (Math.cos(rad) * .5);
            d.y = d.y + (Math.sin(rad) * .5);
        return "translate(" + (d.x) + "," + (d.y) + ")";
    });

    force
        .nodes(nodes)
        .links(links)
        .start();
    bitsPushed = 0;
};