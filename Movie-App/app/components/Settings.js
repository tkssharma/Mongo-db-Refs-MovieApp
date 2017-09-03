/**
 * Created by jafari on 12/23/2016 AD.
 */
import React from 'react';

import Dialog from 'react-md/lib/Dialogs';
import Radio from 'react-md/lib/SelectionControls/Radio';
import Button from 'react-md/lib/Buttons';

class Settings extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Button floating primary fixed onClick={this.props.toggle}
                        disabled={this.props.disabled}>settings</Button>
                <Dialog
                    id="settings"
                    visible={this.props.show}
                    title="Settings"
                    onHide={this.props.toggle}>
                    {
                        this.props.data.map(item=>
                            <fieldset key={item.title+'Field'}>
                                <legend className="md-subheading-1">{item.title}</legend>
                                {
                                    item.options.map(option=>
                                        <Radio
                                            key={option.label+'Option'}
                                            id={item.title.replace(' ','')+option.label}
                                            name={item.title}
                                            value={option.value}
                                            label={option.label}
                                            checked={item.value == option.value}
                                            onChange={item.onChange}/>
                                    )
                                }
                            </fieldset>
                        )
                    }
                </Dialog>
            </div>
        );
    }
}

export default Settings;