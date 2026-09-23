// libs/shared/reusableComponents/src/lib/socialMediaButtons.tsx
import type { JSX } from "react";

// 1. Define a type for the data structure
interface SocialLink {
    name: string;
    icon: JSX.Element;
    urlTemplate: string; 
}

interface ShareProps {
    description: string;
}

// 2. Define the Social Media Data (Site Sharing Only)
const SOCIAL_LINKS: SocialLink[] = [
    {
        name: "Facebook",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        urlTemplate: "https://www.facebook.com/sharer/sharer.php?u=$url",
    },
    {
        name: "Twitter (X)",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z"></path>
            </svg>
        ),
        urlTemplate: "https://twitter.com/intent/tweet?url=$url&text=$description",
    },
    {
        name: "LinkedIn",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 1C1.44772 1 1 1.44772 1 2V13C1 13.5523 1.44772 14 2 14H13C13.5523 14 14 13.5523 14 13V2C14 1.44772 13.5523 1 13 1H2ZM3.05 6H4.95V12H3.05V6ZM5.075 4.005C5.075 4.59871 4.59371 5.08 4 5.08C3.4063 5.08 2.925 4.59871 2.925 4.005C2.925 3.41129 3.4063 2.93 4 2.93C4.59371 2.93 5.075 3.41129 5.075 4.005ZM12 8.35713C12 6.55208 10.8334 5.85033 9.67449 5.85033C9.29502 5.83163 8.91721 5.91119 8.57874 6.08107C8.32172 6.21007 8.05265 6.50523 7.84516 7.01853H7.79179V6.00044H6V12.0047H7.90616V8.8112C7.8786 8.48413 7.98327 8.06142 8.19741 7.80987C8.41156 7.55832 8.71789 7.49825 8.95015 7.46774H9.02258C9.62874 7.46774 10.0786 7.84301 10.0786 8.78868V12.0047H11.9847L12 8.35713Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
        ),
        urlTemplate: "https://www.linkedin.com/sharing/share-offsite/?url=$url",
    },
    {
        name: "Pinterest",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <g><path d="M9.313 23.75l-0.156 0.563c-0.219 0.906-0.719 1.75-1.156 2.438 1.063 0.281 2.094 0.438 3.188 0.438 3.094 0 5.875-1.219 7.938-3.25 2.031-2.031 3.281-4.844 3.281-7.938s-1.25-5.906-3.281-7.938c-2.063-2.031-4.844-3.281-7.938-3.281s-5.875 1.25-7.906 3.281c-2.063 2.031-3.281 4.844-3.281 7.938 0 2.313 0.656 4.438 1.875 6.188 1.188 1.75 2.875 3.188 4.813 4.031-0.031-0.781 0.031-1.656 0.219-2.5 0.031-0.25 0.125-0.625 0.25-1.125 0.094-0.438 0.25-1.063 0.438-1.875 0.188-0.781 0.438-1.813 0.719-3.125-0.094-0.188-0.156-0.375-0.188-0.594-0.125-0.406-0.188-0.781-0.156-1.188 0-1.625 0.938-2.906 2.188-2.906 1.031 0 1.5 0.781 1.5 1.688 0 0.5-0.156 1.094-0.375 1.813-0.25 0.75-0.469 1.406-0.625 2.156-0.156 0.594 0 1.125 0.344 1.531 0.344 0.375 0.875 0.625 1.438 0.625 1.063 0 1.938-0.656 2.563-1.75s1-2.594 1-4.219c0-1.219-0.406-2.25-1.219-3.031s-1.969-1.219-3.469-1.219c-1.688 0-3.063 0.594-4.031 1.594s-1.5 2.344-1.5 3.781c0 0.906 0.281 1.594 0.781 2.156 0.156 0.25 0.219 0.344 0.156 0.625-0.031 0.094-0.094 0.25-0.125 0.438-0.094 0.406-0.125 0.938-0.688 0.75-1.563-0.625-2.281-2.375-2.281-4.313 0-1.594 0.656-3.313 2-4.656 1.344-1.375 3.375-2.313 6-2.313 2.156 0 3.938 0.75 5.188 1.969 1.25 1.188 1.906 2.813 1.906 4.438 0 2.219-0.594 4.125-1.656 5.5s-2.594 2.188-4.375 2.188c-1.219 0-2.344-0.625-2.75-1.406-0.188 0.688-0.313 1.188-0.406 1.563-0.094 0.406-0.156 0.75-0.219 0.938z"></path> </g>
            </svg>
        ),
        urlTemplate: "https://pinterest.com/pin/create/button/?url=$url&description=$description",
    },
    {
        name: "Instagram",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        urlTemplate: "https://www.instagram.com/",
    },
    {
        name: "YouTube",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"></path>
            </svg>
        ),
        urlTemplate: "https://www.youtube.com/results?search_query=$url",
    },
    {
        name: "GitHub",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        urlTemplate: "https://github.com/search?q=$url",
    },
];

// 3. Sub-component for a single share button
function SocialButton({ link, url, description }: { link: SocialLink; url: string; description: string }) {
    const finalUrl = link.urlTemplate
        .replace('$url', encodeURIComponent(url))
        .replace('$description', encodeURIComponent(description));
    
    const title = `Share on ${link.name}`;

    return (
        <a 
            href={finalUrl}
            title={title}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 dark:hover:text-white text-gray-500"
        >
            {link.icon}
            <span className="sr-only">{title}</span>
        </a>
    );
}

// 4. Main Component
function SocialMediaButtons({ description }: ShareProps) {
    const url = typeof window !== 'undefined' ? window.location.href : ''; 
    const isShareApiSupported = typeof navigator !== 'undefined' && !!navigator.share;

    const handleShareWebAPI = async () => {
        if (isShareApiSupported) {
            try {
                await navigator.share({
                    title: description,
                    url: url,
                });
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.error("Error Sharing:", err);
                }
            }
        } else {
            alert("Share API is not supported in your browser.");
        }
    };

    return (
        <span className="inline-flex">
            <div className="justify-center sm:mt-0 flex mt-1 space-x-6">
                {isShareApiSupported && (
                    <button 
                        onClick={handleShareWebAPI} 
                        title="Share via mobile/desktop API" 
                        className="hover:text-gray-800 dark:hover:text-white text-gray-500"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18 16.08c-.76 0-1.44.3-2.01.76l-7.48-3.74c.05-.13.08-.27.08-.41s-.03-.28-.08-.4l7.47-3.74c.57.46 1.25.76 2.01.76 2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4c0 .14.03.27.08.4l-7.48 3.74c-.57-.46-1.25-.76-2.01-.76-2.21 0-4 1.79-4 4s1.79 4 4 4c.76 0 1.44-.3 2.01-.76l7.48 3.74c-.05.13-.08.27-.08.41 0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4z" />
                        </svg>
                        <span className="sr-only">Native Share</span>
                    </button>
                )}
                
                {SOCIAL_LINKS.map((link) => (
                    <SocialButton 
                        key={link.name} 
                        link={link} 
                        url={url} 
                        description={description} 
                    />
                ))}
            </div>
        </span>
    );
}

export { SocialMediaButtons };