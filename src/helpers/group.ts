class Group {
    groupBy<T,K>(list: T[], getKey: (item: T) => K ) {
        const map = new Map<K,T[]>();
        list.forEach((item) => {
             const key = getKey(item);
             const collection = map.get(key);
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