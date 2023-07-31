"use client"
import {useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

import Form from "@/components/Form";

const Page = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [submitting, setSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: '',
        tag: ''
    });
    const createPrompt = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch("/api/prompt/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: post.prompt,
                    tag: post.tag,
                    userId: session?.user.id
                })
            });

            if (response.ok)
                router.push("/")


        } catch (error) {
            console.log(error);
        }
        setSubmitting(false);
    }
    return (
        <Form
            type="create"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmitting={createPrompt}
        />
    );
};


export default Page;