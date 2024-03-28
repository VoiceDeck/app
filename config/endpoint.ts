const production = "https://app.voicedeck.org"
const development = "https://app.vd-dev.org"
const localhost = "http://localhost:3000"

export const getVoiceDeckUrl = () => {
    if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "production") {
        return production
    } else if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "development") {
        return development
    } else {
        return localhost
    }
}

