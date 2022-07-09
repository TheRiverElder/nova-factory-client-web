export function simpleResponse<T>(promise: Promise<T>, action: string, handler: (msg: string) => void) {
    handler("行动：" + action);
    promise
        .then(() => handler("成功：" + action))
        .catch((err) => handler(`失败：${action}，原因：${err}`));
}

export function arrayPeek<T>(arr: Array<T>): T {
    return arr[arr.length - 1];
}