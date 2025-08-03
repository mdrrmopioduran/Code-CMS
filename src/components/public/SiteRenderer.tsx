/**
 * Public site renderer that displays pages built with the page builder
 */
import React, { useEffect, useState } from 'react';
import { PageBlock } from '../../types/cms';
import { Button } from '../ui/button';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: PageBlock[];
  status: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

interface SiteRendererProps {
  slug: string;
  isPreview?: boolean;
}

export default function SiteRenderer({ slug, isPreview = false }: SiteRendererProps) {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        // Mock API call - replace with actual API
        const mockPage: Page = {
          id: '1',
          title: 'Welcome to Our Site',
          slug,
          content: [
            {
              id: '1',
              type: 'heading',
              content: {
                text: 'Welcome to Our Amazing Website',
                level: 'h1',
                alignment: 'center'
              },
              order: 0
            },
            {
              id: '2',
              type: 'text',
              content: {
                text: 'This is a beautiful website built with our modern CMS. You can create stunning pages with our drag-and-drop builder.',
                alignment: 'center'
              },
              order: 1
            },
            {
              id: '3',
              type: 'image',
              content: {
                src: 'https://pub-cdn.sider.ai/u/U0KAH94GG31/web-coder/688f5e232b2b5e92a4f427bb/resource/3a0a2c89-9d02-47d6-b416-18d6a61f95aa.jpg',
                alt: 'Modern Website Design',
                width: '100%',
                alignment: 'center'
              },
              order: 2
            },
            {
              id: '4',
              type: 'button',
              content: {
                text: 'Get Started',
                url: '/contact',
                style: 'primary',
                size: 'lg',
                alignment: 'center'
              },
              order: 3
            }
          ],
          status: 'published',
          seoTitle: 'Welcome - Modern CMS',
          seoDescription: 'Experience the power of modern content management with our drag-and-drop website builder.',
          seoKeywords: 'cms, website builder, modern, drag-and-drop'
        };

        setPage(mockPage);
      } catch (err) {
        setError('Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  /**
   * Render a page block based on its type
   */
  const renderBlock = (block: PageBlock) => {
    const blockStyles = {
      textAlign: block.content.alignment || 'left',
      marginBottom: '2rem'
    };

    switch (block.type) {
      case 'heading':
        const HeadingTag = block.content.level as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            key={block.id}
            style={blockStyles}
            className="font-bold leading-tight"
          >
            {block.content.text}
          </HeadingTag>
        );

      case 'text':
        return (
          <div
            key={block.id}
            style={blockStyles}
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: block.content.text }}
          />
        );

      case 'image':
        return (
          <div key={block.id} style={blockStyles}>
            <img
              src={block.content.src}
              alt={block.content.alt}
              style={{ width: block.content.width }}
              className="max-w-full h-auto"
            />
          </div>
        );

      case 'button':
        return (
          <div key={block.id} style={blockStyles}>
            <Button
              variant={block.content.style === 'primary' ? 'default' : 
                     block.content.style === 'secondary' ? 'secondary' : 'outline'}
              size={block.content.size}
              asChild
            >
              <a href={block.content.url}>{block.content.text}</a>
            </Button>
          </div>
        );

      case 'separator':
        return (
          <hr
            key={block.id}
            style={{
              borderStyle: block.content.style,
              width: block.content.width,
              borderColor: block.content.color,
              margin: '2rem auto'
            }}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground">Page not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Head */}
      <head>
        <title>{page.seoTitle || page.title}</title>
        <meta name="description" content={page.seoDescription} />
        <meta name="keywords" content={page.seoKeywords} />
        <meta property="og:title" content={page.seoTitle || page.title} />
        <meta property="og:description" content={page.seoDescription} />
        <meta property="og:type" content="website" />
      </head>

      {/* Page Content */}
      <div className="min-h-screen bg-background">
        {isPreview && (
          <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-center text-sm">
            <strong>Preview Mode</strong> - This is how your page will appear to visitors
          </div>
        )}
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {page.content
              .sort((a, b) => a.order - b.order)
              .map(renderBlock)}
          </div>
        </main>
      </div>
    </>
  );
}
