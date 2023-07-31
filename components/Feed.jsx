"use client"
import React, {useEffect, useState} from "react";
import PromptCard from "@/components/PromptCard";

const PromptCardList = ({data, handleTagClick}) => (
    <div className="mt-16 prompt_layout">
        {
            data.map((post) => (
                <PromptCard
                    key={post._id}
                    post={post}
                    handleTagClick={handleTagClick}
                />
            ))
        }
    </div>
)
const Feed = () => {
    const [searchText, setSearchText] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [searchedResults, setSearchedResults] = useState([]);
    const [posts, setPosts] = useState([]);
    const fetchPosts = async () => {
        const response = await fetch("/api/prompt");
        const data = await response.json();
        setPosts(data);
    }
    useEffect(() => {
        fetchPosts();
    }, []);

    const filterPrompts = (searchText) => {
        const regex = new RegExp(searchText, "i"); //'i' for case-insensitive
        return posts.filter((item) =>
            regex.test(item.creator.username) ||
            regex.test(item.tag) ||
            regex.test(item.prompt)
        );
    }

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);

        //debounce method
        const timeout = setTimeout(() => {
            const searchResults = filterPrompts(e.target.value);
            setSearchedResults(searchResults);
        }, 500);
        setSearchTimeout(timeout);

    }

    const handleTagClick = (tagName) => {
        setSearchText(tagName);
        const filterResults = filterPrompts(tagName);
        setSearchedResults(filterResults);
    }

    return (
        <section className="feed">
            <form className="relative w-full flex-center">
                <input
                    type="text"
                    className="search_input peer"
                    placeholder="Search for prompt"
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                />
            </form>
            {searchText ? (
                <PromptCardList
                    data={searchedResults}
                    handleTagClick={handleTagClick}
                />
            ):(
                <PromptCardList
                    data={posts}
                    handleTagClick={handleTagClick}
                />
            )}
        </section>
    );
}

export default Feed;