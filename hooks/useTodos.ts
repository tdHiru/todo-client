import useSWR from "swr";
const fetcher = async(key: string) => {
    return fetch(key).then((res) => res.json());
}

export const useTodos = () => {
    const { data, isLoading, error, mutate } = useSWR(
        "http://localhost:8080/alltodos",
        fetcher
    );

    return {
        todos: data,
        isLoading,
        error,
        mutate,
    };
};
