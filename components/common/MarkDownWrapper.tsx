import Head from 'next/head';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  .markdown-body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
      sans-serif, Apple Color Emoji, Segoe UI Emoji;
    font-size: 16px;
    line-height: 1.5;
    word-wrap: break-word;
    box-sizing: border-box;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }

    h1,
    h2 {
      padding-bottom: 0.3em;
      border-bottom: 1px solid;
    }

    h2 {
      font-size: 1.5em;
    }

    blockquote details dl ol p pre table ul {
      margin-top: 0;
      margin-bottom: 16px;
    }

    blockquote {
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;
    }
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    color: #0366d6;
    text-decoration: none;
    background-color: initial;

    &:active,
    &:hover {
      outline-width: 0;
    }

    &:hover {
      text-decoration: underline;
    }
  }

  code,
  pre,
  tt {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  }

  .highlight pre,
  pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 6px;
  }

  pre > code {
    padding: 0;
    margin: 0;
    font-size: 100%;
    word-break: normal;
    white-space: pre;
    background: transparent;
    border: 0;
  }

  pre code,
  pre tt {
    display: inline;
    max-width: auto;
    padding: 0;
    margin: 0;
    overflow: visible;
    line-height: inherit;
    word-wrap: normal;
    background-color: initial;
    border: 0;
  }

  code,
  tt {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 6px;
  }

  ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }

  ol,
  ul {
    padding-left: 2em;
    list-style-type: disc;

    ul {
      list-style-type: circle;
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  li {
    display: list-item;
    text-align: -webkit-match-parent;

    &::marker {
      unicode-bidi: isolate;
      font-variant-numeric: tabular-nums;
      text-transform: none;
      text-indent: 0px !important;
      text-align: start !important;
      text-align-last: start !important;
    }
  }

  table {
    border-spacing: 0;
    border-collapse: collapse;
    display: block;
    width: 100%;
    width: -webkit-max-content;
    width: -moz-max-content;
    width: max-content;
    max-width: 100%;
    overflow: auto;

    tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
    }

    th {
      display: table-cell;
      vertical-align: inherit;
      font-weight: bold;
      text-align: -internal-center;
      font-weight: 600;
    }

    td,
    th {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }

    tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
    }
  }

  thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
  }

  tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
  }
`;

interface MarkDownWrapperProps {}

const MarkDownWrapper = ({
  children,
}: PropsWithChildren<MarkDownWrapperProps>) => {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='stylesheet' href='github-markdown.css' />
      </Head>
      <Wrapper>
        <div className='markdown-body'>{children}</div>
      </Wrapper>
    </>
  );
};

export default MarkDownWrapper;
