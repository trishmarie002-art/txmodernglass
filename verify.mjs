import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
const root=new URL('./dist/',import.meta.url);
const pages=readdirSync(root,{recursive:true}).filter(p=>p.endsWith('.html'));
const titles=new Set(),descriptions=new Set();
for(const file of pages){const html=readFileSync(new URL(file,root),'utf8');assert.equal((html.match(/<h1\b/g)||[]).length,1,`${file}: one H1 required`);const title=html.match(/<title>(.*?)<\/title>/)[1];const description=html.match(/<meta name="description" content="([^"]+)"/)[1];assert(!titles.has(title),`${file}: duplicate title`);assert(!descriptions.has(description),`${file}: duplicate description`);titles.add(title);descriptions.add(description);assert(!html.includes('Lorem ipsum'));for(const match of html.matchAll(/href="(\/[^"?#]*)/g)){const path=match[1];assert(existsSync(new URL(path==='/'?'index.html':path.slice(1)+(path.includes('.')?'':'.html'),root)),`${file}: broken link ${path}`)}for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(match[1]);}
const posts=JSON.parse(readFileSync(new URL('./content/posts.json',import.meta.url)));const slugs=new Set();for(const p of posts){assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug));assert(!slugs.has(p.slug));slugs.add(p.slug);assert(p.h1&&p.metaTitle&&p.metaDescription);assert.equal(p.paragraphs.join(' ').trim().split(/\s+/).length,300,`${p.slug}: exactly 300 body words required`);}
const faqs=JSON.parse(readFileSync(new URL('./content/faqs.json',import.meta.url)));assert.equal((readFileSync(new URL('faq.html',root),'utf8').match(/<details /g)||[]).length,faqs.length);
const areas=JSON.parse(readFileSync(new URL('./content/area-pages.json',import.meta.url)));const areaSlugs=new Set();
assert.equal(areas.length,30,'Exactly 30 service-area pages required');
assert.equal(new Set(areas.map(a=>a.city)).size,30,'Service areas must be unique');
assert(!areas.some(a=>['San Antonio','Converse'].includes(a.city)),'Excluded cities must not be targeted');
assert(!existsSync(new URL('areas/san-antonio-glass-installation.html',root)));
assert(!existsSync(new URL('areas/converse-glass-installation.html',root)));
const business=JSON.parse(readFileSync(new URL('./content/business.json',import.meta.url)));
assert.equal(business.areas.length,30);assert(business.address.includes('Converse'));
for(const area of areas){assert(!areaSlugs.has(area.slug));areaSlugs.add(area.slug);assert(area.city&&area.sections?.length);assert(readFileSync(new URL(`areas/${area.slug}.html`,root),'utf8').includes(area.h1));}
for(const post of posts){
 assert(post.h1.includes('Central Texas'),`${post.slug}: regional H1 required`);
 assert(!JSON.stringify(post).includes('Seguin'),`${post.slug}: blogs must focus on Central Texas`);
 assert(post.metaDescription.length>=140&&post.metaDescription.length<=160,`${post.slug}: description length`);
 const html=readFileSync(new URL(`blog/${post.slug}.html`,root),'utf8');
 const rendered=html.match(/<div class="article-body">([\s\S]*?)<\/div>/)[1].replace(/<[^>]*>/g,' ').trim();
 assert.equal(rendered.split(/\s+/).length,300,`${post.slug}: rendered article word count`);
 const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 const schema=schemas.find(s=>s['@type']==='BlogPosting');assert(schema);assert.equal(schema.headline,post.h1);assert.equal(schema.wordCount,300);assert.equal(schema.articleBody,post.paragraphs.join('\n\n'));
 assert(html.includes('Discuss your Central Texas glass project'));
}
if(existsSync(new URL('sitemap.xml',root))){
 const sitemap=readFileSync(new URL('sitemap.xml',root),'utf8');const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 assert.equal(urls.length,pages.length-1,'Sitemap must list every page except 404');assert.equal(new Set(urls).size,urls.length);
 for(const file of pages.filter(f=>f!=='404.html')){const html=readFileSync(new URL(file,root),'utf8');const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)[1];assert(urls.includes(canonical),`${file}: canonical missing from sitemap`);}
}
assert(existsSync(new URL('logo.webp',root)));console.log(`Verified ${pages.length} pages: unique metadata, one H1, valid structured data, local links, FAQ content, logo; ${posts.length} blog articles.`);
