export default class Result <ValueType, ErrorType> {

    private value?: ValueType;
    private error?: ErrorType;

    public of(value: ValueType) {
        this.value = value;
    }

    public errorOf(error: ErrorType) {
        this.error = error;
    }

    public isPresent(): boolean {
        return this.value !== undefined;
    }

    public isError(): boolean {
        return this.error !== undefined;
    }

    public get(): ValueType {
        return this.value!;
    }

    public getError(): ErrorType {
        return this.error!;
    }

}