import "dotenv/config";
import got from "got";

const { MS_API_BASE, MS_API_TOKEN } = process.env;

const options = {
  prefixUrl: MS_API_BASE,
  headers: {
    Authorization: `Bearer ${MS_API_TOKEN}`,
  },
};

const client = got.extend(options);

export async function fetchNotebooks() {
  return await client.get("v1.0/me/onenote/notebooks").json();
}

export async function fetchSections(notebookId) {
  return await client.get(`v1.0/me/onenote/notebooks/${notebookId}/sections`).json();
}

export async function fetchPages(sectionId, skip) {
  if (skip && skip > 0) {
    return await client.get(`v1.0/me/onenote/sections/${sectionId}/pages?$skip=${skip}`).json();
  }

  return  await client.get(`v1.0/me/onenote/sections/${sectionId}/pages`).json();
}

export async function fetchPageContent(pageId) {
  return (await client.get(`v1.0/me/onenote/pages/${pageId}/content`)).body;
}
