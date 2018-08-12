import * as monaco from 'monaco-editor';
import * as React from 'react';

export default class Monaco extends React.Component {
  private divRef: React.RefObject<HTMLDivElement> = React.createRef();
  private editor?: monaco.editor.IStandaloneCodeEditor;
  public componentDidMount() {
    const div = this.divRef.current;
    if (div) {
      this.editor = monaco.editor.create(div, {
        language: 'typescript',
        formatOnType: true,
        theme: 'vs-dark',
      });
    } else {
      throw Error('Monaco: DivRef cannot be found.');
    }
  }
  public render() {
    return (
      <div ref={this.divRef} style={{ width: '500px', height: '500px' }} />
    );
  }
}
