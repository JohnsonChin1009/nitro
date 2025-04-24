pragma circom 2.1.6;

include "../../node_modules/circomlib/circuits/comparators.circom";

template AgeCheck() {
    // Input signals
    signal input birthYear;
    signal input currentYear;
    signal output isOver21;

    // Calculate age
    signal age;
    age <== currentYear - birthYear;

    // Use GreaterThan comparator from circomlib
    // 8 bits is enough to represent age (max 255)
    component gt = GreaterThan(8);
    gt.in[0] <== age;
    gt.in[1] <== 21;

    // Output 1 if age > 21, 0 otherwise
    isOver21 <== gt.out;
}

component main { public [currentYear] } = AgeCheck();