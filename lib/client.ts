import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = sanityClient({
    projectId: '40z69mzh',
    dataset: 'production',
    apiVersion: '2023-01-16',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
})

const builder = imageUrlBuilder(client) 

export const urlFor = (source: any) => builder.image(source)

