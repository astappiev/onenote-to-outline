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

export async function fetchOneNoteNotebooks() {
  return client.get("v1.0/me/onenote/notebooks").json();
}

export async function fetchOneNoteSections(notebookId) {
  return client.get(`v1.0/me/onenote/notebooks/${notebookId}/sections`).json();
}

export async function fetchOneNotePages(sectionId, skip) {
  if (skip && skip > 0) {
    return client.get(`v1.0/me/onenote/sections/${sectionId}/pages?$skip=${skip}`).json();
  }

  return  client.get(`v1.0/me/onenote/sections/${sectionId}/pages`).json();
}

export async function fetchOneNotePageContent(pageId) {
  return (await client.get(`v1.0/me/onenote/pages/${pageId}/content`)).body;
}
