import {fetchOneNoteNotebooks, fetchOneNotePageContent, fetchOneNotePages, fetchOneNoteSections} from "./onenote/api.js";
import {
    createCollections,
    createDocument,
    fetchCollectionsAsMap,
    fetchDocuments
} from "./outline/api.js";

const excludeNotebooks = [
];

const excludePages = [
];

const notebooks = await fetchOneNoteNotebooks();

const collectionsMap = await fetchCollectionsAsMap();

for (const notebook of notebooks.value) {
    if (excludeNotebooks.includes(notebook.id)) {
        continue;
    }

    let collectionId = null;
    const topPagesMap = new Map();

    if (collectionsMap.has(notebook.displayName)) {
        collectionId = collectionsMap.get(notebook.displayName);

        const documents = await fetchDocuments(collectionId);
        documents.forEach((document) => {
            topPagesMap.set(document.title, document.id);
        });
        console.log(`Collection already exists: ${notebook.displayName}`);
    } else {
        const newCollection = await createCollections(notebook.displayName);
        collectionId = newCollection.id;
        collectionsMap.set(notebook.displayName, collectionId);
        console.log(`Created collection: ${notebook.displayName}`);
    }

    const sections = await fetchOneNoteSections(notebook.id);
    for (const section of sections.value) {
        let parentPageId = null;
        const pagesMap = new Map();

        if (topPagesMap.has(section.displayName)) {
            parentPageId = topPagesMap.get(section.displayName);

            const documents = await fetchDocuments(collectionId, parentPageId);
            documents.forEach((document) => {
                pagesMap.set(document.title, document.id);
            });
            console.log(`Top level page already exists: ${section.displayName}`);
        } else {
            const parentPage = await createDocument(collectionId, null, section.displayName, null);
            parentPageId = parentPage.id;
            topPagesMap.set(section.displayName, parentPageId);
            console.log(`Created top level document: ${section.displayName}`);
        }

        let skip = 0;
        while (skip >= 0) {
            const pages = await fetchOneNotePages(section.id, skip);
            console.log(`Found ${pages.value.length} pages. Pages already in collection: ${pagesMap.size}`);
            if (pages['@odata.nextLink']) {
                skip += 20;
            } else {
                skip = -1;
            }

            for (const page of pages.value) {
                if (pagesMap.has(page.title)) {
                    console.log(`-- Document already exists: ${page.title}`);
                    continue;
                }
                if (excludePages.includes(page.id)) {
                    console.log(`-- Page excluded: ${page.title}`);
                    continue;
                }

                const html = await fetchOneNotePageContent(page.id);
                await createDocument(collectionId, parentPageId, page.title, html);
                console.log(`-- Created second level document: ${page.title}`);

                // Rate limit bypass
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
    }
}
