export function readJsonFile<T = any>(file: File): Promise<T> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = () => {
            const result = JSON.parse(fileReader.result as string);
            resolve(result);
        };

        fileReader.onerror = reject;
        fileReader.readAsText(file, 'UTF-8');
    });
}
