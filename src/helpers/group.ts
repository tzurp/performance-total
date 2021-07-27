class Group {
    /**
     * Group list of objects by properties
     * @param list 
     * @param getKey e.g. p => [p.name, p.browserName]
     * @returns 
     */
    groupBy<T, K>(list: T[], getKey: (item: T) => K) {
        const map = new Map<string,T[]>();
        
        list.forEach((item) => {
            const key = JSON.stringify(getKey(item));
            
            const collection = map.get(key)

            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return Array.from(map.values());
    }
}
export default new Group();