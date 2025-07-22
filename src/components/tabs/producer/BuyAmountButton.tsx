export function BuyAmountButton({amount, callback, currentAmount}:
                                {amount: number, callback: () => void, currentAmount: number}) {
    return (
        <button
            className={`text-2xl w-full p-1 border-2 border-muted-foreground 
            ${amount !== currentAmount ?
                "hover:border-foreground hover:bg-hover-card-background cursor-pointer" :
                "bg-hover-card-background border-foreground"}`}
            onClick={callback}>
            {amount}
        </button>
    );
}