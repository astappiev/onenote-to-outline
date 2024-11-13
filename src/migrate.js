import {fetchNotebooks, fetchPageContent, fetchPages, fetchSections} from "./onenote/api.js";
import {createCollections, createDocument, fetchCollections, fetchDocuments} from "./outline/api.js";

const notebooks = await fetchNotebooks();
const excludeNotebooks = [
];
const excludePages = [
];

const existingCollections = (await fetchCollections()).data;
const collectionsMap = existingCollections.reduce((map, obj) => {
    map.set(obj.name, obj.id);
    return map;
}, new Map());

for (const notebook of notebooks.value) {
    if (excludeNotebooks.includes(notebook.id)) {
        continue;
    }

    const sections = await fetchSections(notebook.id);
    for (const section of sections.value) {
        let collectionId = null;
        const pagesMap = new Map();

        if (collectionsMap.has(section.displayName)) {
            collectionId = collectionsMap.get(section.displayName);

            const documents = await fetchDocuments(collectionId);
            documents.data.forEach((document) => {
                pagesMap.set(document.title, document.id);
            });
            console.log(`Collection already exists: ${section.displayName}`);
        } else {
            const newCollection = await createCollections(section.displayName);
            collectionId = newCollection.data.id;
            collectionsMap.set(section.displayName, collectionId);
            console.log(`Created collection: ${section.displayName}`);
        }

        let skip = 0;
        while (skip >= 0) {
            const pages = await fetchPages(section.id, skip);
            console.log(`Found ${pages.value.length} pages. Pages already in collection: ${pagesMap.size}`);
            if (pages['@odata.nextLink']) {
                skip += 20;
            } else {
                skip = -1;
            }

            for (const page of pages.value) {
                if (pagesMap.has(page.title)) {
                    console.log(`-- Page already exists: ${page.title}`);
                    continue;
                }
                if (excludePages.includes(page.id)) {
                    console.log(`-- Page excluded: ${page.title}`);
                    continue;
                }

                const html = await fetchPageContent(page.id);
                await createDocument(collectionId, page.title, html);
                console.log(`-- Created document: ${page.title}`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
    }
}
