"use client"

import React, { useState, useEffect, useCallback, useMemo, use } from 'react';

// --- MOCK API AND HOOKS FOR ENVIRONMENT STABILITY ---
// NOTE: The logic remains the same, but the dependencies are mocked to ensure this single-file component runs.

const axios = {
    post: async (url, data) => {
        // console.log(`[MOCK API CALL] POST to ${url}`, data);
        if (url.includes('/api/get-link-details')) {
            // Simulate success for link fetching
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            return {
                data: {
                    originalUrl: 'https://www.ultimate-destination.com/data/123',
                    userEmail: 'user@example.com'
                }
            };
        }
        // Simulate success for statistics updates
        return { data: { success: true } };
    }
};


// ---------------------------------------------------


const PAGE_SEQUENCE = [
    { type: 'CRYPTO', duration: 3 },
    { type: 'INSURANCE', duration: 3 },
    { type: 'CRYPTO', duration: 3 },
    { type: 'INSURANCE', duration: 3 },
];
const TOTAL_PAGES = PAGE_SEQUENCE.length;
const NEXT_PUBLIC_BASE_URL = "https://link-flow.com"; // Mocked base URL

// --- UI COMPONENTS (Modern Light Mode Design) ---

const BrandingLandingPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-xl w-full p-10 bg-white shadow-2xl rounded-3xl text-center transition duration-300 transform hover:shadow-3xl">
            <div className="text-6xl mb-4 text-indigo-600">⚡</div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                The Next Generation Link Shortener
            </h1>
            <p className="text-xl text-gray-500 mb-6">
                Monetize your traffic and get to your destination quickly and securely.
            </p>
            <a href="#" className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105">
                Create Your Own Link
            </a>
            <p className="mt-8 text-sm text-gray-400">
                A modern solution for intelligent URL management.
            </p>
        </div>
    </div>
);

const LoadingPage = ({ pathSegment }) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Locating Destination
            </h2>
            <p className="text-gray-500 text-lg">
                Verifying link <span className="font-mono text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">/{pathSegment}</span>...
            </p>
        </div>
    </div>
);

const AdPage = ({ type, timer, onContinue, index, total }) => {
    const isReady = timer === 0;

    const adContent = useMemo(() => {
        if (type === 'CRYPTO') {
            return {
                icon: '💰',
                title: 'Unlock the Future of Finance.',
                description: 'Discover high-yield crypto platforms trusted by experts. Invest smart, grow fast.',
                cta: 'Explore Crypto Opportunities',
                color: 'from-blue-500 to-indigo-600',
            };
        }
        if (type === 'INSURANCE') {
            return {
                icon: '🛡️',
                title: 'Protect What Matters Most.',
                description: 'Get instant, personalized quotes for the best home and auto insurance coverage.',
                cta: 'Get My Free Quote',
                color: 'from-green-500 to-teal-600',
            };
        }
        return { icon: '✨', title: 'Special Offer Just For You', description: 'Take a moment to see this exclusive partner message.', cta: 'Continue to Partner Site', color: 'from-pink-500 to-red-600' };
    }, [type]);

    const ProgressCircle = ({ percentage }) => (
        <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    className="text-gray-200"
                    strokeWidth="5"
                    stroke="currentColor"
                    fill="transparent"
                    r="25"
                    cx="32"
                    cy="32"
                />
                <circle
                    className={`text-indigo-600 transition-all duration-300 ease-in-out`}
                    strokeWidth="5"
                    strokeDasharray={2 * Math.PI * 25}
                    strokeDashoffset={(100 - percentage) / 100 * (2 * Math.PI * 25)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="25"
                    cx="32"
                    cy="32"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-800">
                {timer}
            </span>
        </div>
    );

    const progressPercentage = (index / total) * 100;
    const currentStep = index + 1;
    const timePercentage = timer > 0 ? ((PAGE_SEQUENCE[index].duration - timer) / PAGE_SEQUENCE[index].duration) * 100 : 100;

    return (
        <div className="max-w-3xl w-full p-6 sm:p-12 bg-white rounded-3xl shadow-2xl backdrop-blur-sm transform transition duration-500 hover:shadow-3xl">
            {/* Header / Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center text-gray-500 mb-2">
                    <span className="font-medium text-sm">Flow Progress</span>
                    <span className="text-sm">Step {currentStep} of {total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            <div className={`p-8 rounded-2xl text-white shadow-xl mb-8 bg-gradient-to-br ${adContent.color}`}>
                <div className="flex items-center space-x-4 mb-4">
                    <span className="text-4xl">{adContent.icon}</span>
                    <h2 className="text-3xl font-extrabold">{adContent.title}</h2>
                </div>
                <p className="text-lg font-light opacity-90">{adContent.description}</p>
                
                <a href="#" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-sm font-semibold text-white border-b-2 border-white/50 hover:border-white transition duration-300">
                    {adContent.cta}
                </a>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                    <ProgressCircle percentage={timePercentage} />
                    <p className="text-xl text-gray-700 font-medium">
                        {isReady ? (
                            <span className="text-green-600 font-bold">Ready to Proceed!</span>
                        ) : (
                            <span>Destination available in <span className="text-indigo-600 font-bold">{timer}</span> seconds...</span>
                        )}
                    </p>
                </div>

                <button
                    onClick={onContinue}
                    disabled={!isReady}
                    className={`
                        px-8 py-3 font-semibold rounded-full shadow-lg transition duration-300 
                        ${isReady 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 transform hover:scale-105' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                    `}
                >
                    {isReady ? 'Continue to Destination' : 'Wait for Timer'}
                </button>
            </div>
        </div>
    );
};

const FinalRedirectPage = ({ originalURL }) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-50 p-6">
        <div className="max-w-xl w-full p-10 bg-white rounded-3xl shadow-2xl text-center">
            <div className="text-6xl mb-4 text-green-500">✅</div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Flow Complete. Redirecting...
            </h2>
            <p className="text-lg text-gray-600 mb-6">
                Thank you for supporting our service. Your original link is being retrieved now.
            </p>
            <div className="p-4 bg-indigo-100 rounded-xl text-left">
                <p className="text-sm font-medium text-gray-700 mb-1">Target URL:</p>
                <code className="block text-indigo-700 overflow-x-auto text-sm sm:text-base">
                    {originalURL || 'URL Not Available'}
                </code>
            </div>
            <p className="mt-6 text-sm text-gray-500">
                If the redirect doesn&apos;t happen, please click the link above.
            </p>
        </div>
    </div>
);

const ErrorPage = ({ pathSegment }) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6">
        <div className="max-w-xl w-full p-10 bg-white rounded-3xl shadow-2xl text-center border-t-4 border-red-500">
            <div className="text-6xl mb-4 text-red-500">⚠️</div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Link Resolution Error
            </h2>
            <p className="text-lg text-gray-600 mb-6">
                We encountered an issue while trying to fetch details for your link:
            </p>
            <div className="p-4 bg-red-100 rounded-xl text-left">
                <p className="text-sm font-medium text-gray-700 mb-1">Short Link:</p>
                <code className="block text-red-700 overflow-x-auto text-sm sm:text-base">
                    /{pathSegment}
                </code>
            </div>
            <p className="mt-6 text-sm text-gray-500">
                Please check the link provided or contact support if the issue persists.
            </p>
        </div>
    </div>
);

const InvalidURLPage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-6">
        <div className="max-w-xl w-full p-10 bg-white rounded-3xl shadow-2xl text-center border-t-4 border-yellow-500">
            <div className="text-6xl mb-4 text-yellow-500">🚫</div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Invalid URL Format
            </h2>
            <p className="text-lg text-gray-600 mb-6">
                The link structure provided does not match our expected format. Please ensure you are using a single path segment.
            </p>
            <p className="mt-6 text-sm text-gray-500">
                Example: {NEXT_PUBLIC_BASE_URL}/<span className="font-bold">mylinkid</span>
            </p>
        </div>
    </div>
);

// --- CORE LOGIC HOOK (UNMODIFIED) ---

function useMonetizedLinkFlow(pathSegment, isRoot) {
    const [flowState, setFlowState] = useState(
        isRoot ? 'ROOT_PAGE' : 'LOADING_LINK'
    );
    const [originalURL, setOriginalURL] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const initialDuration = PAGE_SEQUENCE[0]?.duration || 10;
    const [timer, setTimer] = useState(initialDuration);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const userLocation = "Placeholder/India";

    const currentAdPage = useMemo(() => PAGE_SEQUENCE[currentPageIndex], [currentPageIndex]);

    const completeFlow = useCallback(async () => {
        setFlowState('FINAL_REDIRECT_PAGE');
        setIsTimerRunning(false);

        if (userEmail) {
            try {
                await axios.post(`/api/update-statistics`, {
                    userEmail,
                    location: userLocation,
                    is_proper_view: true
                });
                console.log("Monetization transaction successful (Proper View).");
            } catch (error) {
                console.error('Failed to update statistics:', error);
            }
        }

        setTimeout(() => {
            if (originalURL && originalURL.startsWith('http')) {
                console.log('API REDIRECT: Would redirect to:', originalURL);
            }
        }, 2000);

    }, [originalURL, userEmail, userLocation]);


    const continueFlow = useCallback(async () => {
        if (currentPageIndex < TOTAL_PAGES - 1) {
            const nextIndex = currentPageIndex + 1;
            setCurrentPageIndex(nextIndex);
            setTimer(PAGE_SEQUENCE[nextIndex].duration);
            setIsTimerRunning(true);

            if (userEmail) {
                try {
                    await axios.post(`/api/update-statistics`, {
                        userEmail,
                        location: userLocation,
                        is_proper_view: false
                    });
                    console.log("Impression successful.");
                } catch (error) {
                    console.error('Failed to update statistics:', error);
                }
            }
        } else {
            completeFlow();
        }
    }, [currentPageIndex, completeFlow, userEmail, userLocation]);

    useEffect(() => {
        if (pathSegment && flowState === 'LOADING_LINK') {
            const fetchLinkDetails = async () => {
                try {
                    const response = await axios.post(`/api/get-link-details`, {
                        shortUrl: pathSegment,
                        location: userLocation,
                    });

                    setOriginalURL(response.data.originalUrl);
                    setUserEmail(response.data.userEmail);

                    setFlowState('AD_PAGE_FLOW');
                    setIsTimerRunning(true);

                } catch (error) {
                    console.error('Error fetching link details:', error);
                    setFlowState('ERROR');
                    setOriginalURL(error.response?.data?.error || 'API connection or Link Not Found.');
                }
            };
            fetchLinkDetails();
        }
    }, [pathSegment, flowState, userLocation]);

    useEffect(() => {
        if (isTimerRunning && flowState === 'AD_PAGE_FLOW') {
            if (timer > 0) {
                const interval = setInterval(() => {
                    setTimer((prev) => prev - 1);
                }, 1000);
                return () => clearInterval(interval);
            } else {
                setIsTimerRunning(false);
            }
        }
    }, [timer, isTimerRunning, flowState]);

    return {
        flowState,
        originalURL,
        currentAdPage,
        timer,
        continueFlow,
        pathSegment,
    };
}

const getPathDetails = (params) => {
    const shortURL = params.shortURL;

    const isRoot = !shortURL || shortURL.length === 0;
    const pathSegment = isRoot ? null : shortURL[0];
    const isInvalidMultiSegment = !isRoot && shortURL.length > 1;

    return { pathSegment, isRoot, isInvalidMultiSegment };
}

// --- MAIN APP COMPONENT ---

export default function App({ params }) {
    const resolvedParams = use(params);
    const { pathSegment, isRoot, isInvalidMultiSegment } = getPathDetails(resolvedParams);

    const {
        flowState,
        originalURL,
        currentAdPage,
        timer,
        continueFlow,
        pathSegment: usedPathSegment,
    } = useMonetizedLinkFlow(pathSegment, isRoot);

    const renderContent = () => {
        if (isInvalidMultiSegment) {
            return <InvalidURLPage />;
        }

        if (isRoot) {
            return <BrandingLandingPage />;
        }

        switch (flowState) {
            case 'LOADING_LINK':
                return <LoadingPage pathSegment={usedPathSegment} />;
            case 'AD_PAGE_FLOW':
                // Removed the extra div wrapper to let AdPage control the layout
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-8">
                        <AdPage
                            type={currentAdPage.type}
                            timer={timer}
                            onContinue={continueFlow}
                            index={PAGE_SEQUENCE.findIndex(p => p === currentAdPage)}
                            total={TOTAL_PAGES}
                        />
                    </div>
                );
            case 'FINAL_REDIRECT_PAGE':
                return <FinalRedirectPage originalURL={originalURL} />;
            case 'ERROR':
                return <ErrorPage pathSegment={usedPathSegment} />;
            case 'ROOT_PAGE':
                return <BrandingLandingPage />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-8">
                        <div className="animate-pulse text-2xl font-semibold text-indigo-500">System Initializing...</div>
                    </div>
                )
        }
    };

    return (
        <div className="min-h-screen font-sans antialiased">
            {renderContent()}
        </div>
    );
}
