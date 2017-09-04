import * as big from "bignumber.js";

// Adapted from: https://stackoverflow.com/questions/5529934/javascript-numbers-to-words
export function Humanize(n: big.BigNumber, round?: number): string {

    let str = "" + n.toFixed(0), units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words,
        and = "and";

    let shouldRound: boolean = round && round > 0 && str.length > round;
    if (shouldRound) {
        let rounded = str.slice(0, round) + "".padEnd(str.length - round, "0");

        if (new big(rounded).eq(n)) {
            shouldRound = false;
        } else {
            str = rounded;
        }
    }

    /* Is number zero? */
    if (n.eq(0)) {
        return "zero";
    }

    /* Array of units as words */
    units = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];

    /* Array of tens as words */
    tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

    /* Array of scales as words. From: https://en.wikipedia.org/wiki/Names_of_large_numbers */
    scales = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion", "Duodecillion", "Tredecillion", "Quattuordecillion", "Quinquadecillion", "Sedecillion", "Septendecillion", "Octodecillion", "Novendecillion", "Vigintillion", "Unvigintillion", "Duovigintillion", "Tresvigintillion", "Quattuorvigintillion", "Quinquavigintillion", "Sesvigintillion", "Septemvigintillion", "Octovigintillion", "Novemvigintillion", "Trigintillion", "Untrigintillion", "Duotrigintillion", "Trestrigintillion", "Quattuortrigintillion", "Quinquatrigintillion", "Sestrigintillion", "Septentrigintillion", "Octotrigintillion", "Noventrigintillion", "Quadragintillion"];

    /* Split user argument into 3 digit chunks from right to left */
    start = str.length;
    chunks = [];
    while (start > 0) {
        end = start;
        chunks.push(str.slice(( start = Math.max(0, start - 3) ), end));
    }

    /* Check if function has enough scale words to be able to stringify the user argument */
    chunksLen = chunks.length;
    if (chunksLen > scales.length) {
        return "a lot of";
    }

    /* Stringify each integer in each chunk */
    words = [];
    for (i = 0; i < chunksLen; i++) {

        chunk = parseInt(chunks[i]);

        if (chunk) {

            /* Split chunk into array of individual integers */
            ints = chunks[i].split("").reverse().map(parseFloat);

            /* If tens integer is 1, i.e. 10, then add 10 to units integer */
            if (ints[1] === 1) {
                ints[0] += 10;
            }

            /* Add scale word if chunk is not zero and array item exists */
            if (( word = scales[i] )) {
                words.push(word);
            }

            /* Add unit word if array item exists */
            if (( word = units[ints[0]] )) {
                words.push(word);
            }

            /* Add tens word if array item exists */
            if (( word = tens[ints[1]] )) {
                words.push(word);
            }

            /* Add "and" string after units or tens integer if: */
            if (ints[0] || ints[1]) {

                /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
                if (ints[2] || !i && chunksLen > 1) {
                    words.push(and);
                }
            }

            /* Add hundreds word if array item exists */
            if (( word = units[ints[2]] )) {
                words.push(word + " hundred");
            }
        }

    }

    return `${shouldRound ? "about " : " "}${words.reverse().join(" ").toLowerCase()}`;
}