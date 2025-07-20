import {GigaNum} from "./util/GigaNum.ts";

export function App() {

    let d = new GigaNum(3.32, 12000);
    console.log(d.toString());
    d = d.divide(new GigaNum(1.66, 2000));
    console.log(d.toString());
    d = d.multiply(1000);
    console.log(d.toString());
    d = d.multiply(new GigaNum(8, 10000));
    console.log(d.toString());
    d = d.divide(2);
    console.log(d.toString());
    d = d.multiply(0);
    console.log(d.toString());
    d = new GigaNum(2, 100);
    d = d.pow(0.5);
    console.log(d.toString());
    console.log(new GigaNum(199909320913).toString());

    return (
        <>

        </>
    );
}
