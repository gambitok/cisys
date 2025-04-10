import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function AlarmData({ data,errors,setData }) {

    const information_display = ['IP address', 'User Name', 'Computer Name', 'OS Info', 'Device ID', 'Group'];

    const handleChange = (e) => {
        let id = e.target.value;
        let name = e.target.name;

        e.target.checked
            ? setData(name, [...data[name], id])
            : setData(
                name,
                data[name].filter((item) => {
                    return item !== id;
                })
            );
    };

    function defaultDataDefine(alarmId){
        const newData = { ...data };
        if (newData['alarm_height_'+alarmId] === undefined) {
            newData['alarm_code_'+alarmId] = 0;
            newData['alarm_message_'+alarmId] = 'Alarm message';
            newData['alarm_height_'+alarmId] = 20;
            newData['alarm_border_'+alarmId] = 5;
            newData['alarm_color_'+alarmId] = '#ff0000';
            newData['alarm_text_size_'+alarmId] = 0;
            newData['alarm_heartbeat_'+alarmId] = 0;
            newData['alarm_center_text_'+alarmId] = 'CYBER INTEL SYSTEMS';
            newData['alarm_right_text_'+alarmId] = 'DEMO';
            newData['alarm_text_color_'+alarmId] = '#ffffff';
            setData(newData);
        }
    }

    return (
        <>
            {Array.from(
                Array(data.alarm), (v,i) =>
                    <div id={'alarmFrom-'+(i+1)} style={{display: data.alarmselect==i+1 ? "":"none"}}>
                        {defaultDataDefine(i+1)}

                        <div className='row g-3 my-2'>
                            <div className='col-md-6'>
                                <div className="mb-3">
                                    <InputLabel htmlFor={'alarm_code_'+(i+1)} value="Alarm type" />
                                    <TextInput
                                        id={'alarm_code_'+(i+1)}
                                        value={data['alarm_code_'+(i+1)]}
                                        onChange={(e) => setData('alarm_code_'+(i+1), e.target.value)}
                                        type="number"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="current-alarm_code"
                                        placeholder="Alarm type"
                                    />
                                    <InputError message={errors['alarm_code_'+(i+1)]} className="mt-2" />
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="mb-3">
                                    <InputLabel htmlFor={'alarm_message_'+(i+1)} value="Alarm message" />
                                    <TextInput
                                        id={'alarm_message_'+(i+1)}
                                        value={data['alarm_message_'+(i+1)]}
                                        onChange={(e) => setData('alarm_message_'+(i+1), e.target.value)}
                                        type="text"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="current-alarm_message"
                                        placeholder="Alarm message"
                                    />
                                    <InputError message={errors['alarm_message_'+(i+1)]} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <div className='row g-3 my-2'>
                            <div className='col-md-6'>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className="mb-3">
                                            <InputLabel htmlFor={'alarm_height_'+(i+1)} value="Alarm Height (px)" />
                                            <TextInput
                                                id={'alarm_height_'+(i+1)}
                                                value={data['alarm_height_'+(i+1)]}
                                                onChange={(e) => setData('alarm_height_'+(i+1), e.target.value)}
                                                type="number"
                                                className="mt-1 block w-full form-control"
                                                autoComplete="current-alarm_height"
                                                placeholder="Alarm Height (px)"
                                            />
                                            <InputError message={errors['alarm_height_'+(i+1)]} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className='col-md-4'>
                                        <div className="mb-3">
                                            <InputLabel htmlFor={'alarm_border_'+(i+1)} value="Alarm Border (px)" />
                                            <TextInput
                                                id={'alarm_border_'+(i+1)}
                                                value={data['alarm_border_'+(i+1)]}
                                                onChange={(e) => setData('alarm_border_'+(i+1), e.target.value)}
                                                type="number"
                                                className="mt-1 block w-full form-control"
                                                autoComplete="current-alarm_border"
                                                placeholder="Alarm Border (px)"
                                            />
                                            <InputError message={errors['alarm_border_'+(i+1)]} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className='col-md-4'>
                                        <div className="mb-3">
                                            <InputLabel htmlFor={'alarm_color_'+(i+1)} value="Alarm Color" />
                                            <TextInput
                                                id={'alarm_color_'+(i+1)}
                                                value={data['alarm_color_'+(i+1)]}
                                                onChange={(e) => setData('alarm_color_'+(i+1), e.target.value)}
                                                type="color"
                                                className="mt-1 block w-full form-control"
                                                autoComplete="current-alarm_color"
                                                placeholder="Alarm Color"
                                            />
                                            <InputError message={errors['alarm_color_'+(i+1)]} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className="mb-3">
                                            <InputLabel htmlFor={'alarm_center_text_'+(i+1)} value="Alarm Center Text" />
                                            <TextInput
                                                id={'alarm_center_text_'+(i+1)}
                                                value={data['alarm_center_text_'+(i+1)]}
                                                onChange={(e) => setData('alarm_center_text_'+(i+1), e.target.value)}
                                                type="text"
                                                className="mt-1 block w-full form-control"
                                                autoComplete="current-alarm_center_text"
                                                placeholder="Alarm Center Text"
                                            />
                                            <InputError message={errors['alarm_center_text_'+(i+1)]} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className='col-md-4'>
                                        <div className="mb-3">
                                            <InputLabel htmlFor={'alarm_right_text_'+(i+1)} value="Alarm Right text" />
                                            <TextInput
                                                id={'alarm_right_text_'+(i+1)}
                                                value={data['alarm_right_text_'+(i+1)]}
                                                onChange={(e) => setData('alarm_right_text_'+(i+1), e.target.value)}
                                                type="text"
                                                className="mt-1 block w-full form-control"
                                                autoComplete="current-alarm_right_text"
                                                placeholder="Alarm Right text"
                                            />
                                            <InputError message={errors['alarm_right_text_'+(i+1)]} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className='col-md-4'>
                                        <div className="mb-3">
                                            <InputLabel htmlFor={'alarm_text_color_'+(i+1)} value="Alarm Text Color" />
                                            <TextInput
                                                id={'alarm_text_color_'+(i+1)}
                                                value={data['alarm_text_color_'+(i+1)]}
                                                onChange={(e) => setData('alarm_text_color_'+(i+1), e.target.value)}
                                                type="color"
                                                className="mt-1 block w-full form-control"
                                                autoComplete="current-alarm_text_color"
                                                placeholder="Alarm Text Color"
                                            />
                                            <InputError message={errors['alarm_text_color_'+(i+1)]} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className="mb-3">
                                            <InputLabel htmlFor={'alarm_text_size_'+(i+1)} value="Alarm Text Size (pt)" />
                                            <TextInput
                                                id={'alarm_text_size_'+(i+1)}
                                                value={data['alarm_text_size_'+(i+1)]}
                                                onChange={(e) => setData('alarm_text_size_'+(i+1), e.target.value)}
                                                type="number"
                                                className="mt-1 block w-full form-control"
                                                autoComplete="current-alarm_text_size"
                                                placeholder="Alarm Text Size (pt)"
                                            />
                                            <InputError message={errors['alarm_text_size_'+(i+1)]} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className='col-md-4'>
                                        <div className="mb-3">
                                            <InputLabel htmlFor={'alarm_heartbeat_'+(i+1)} value="Alarm Heartbeat (seconds)" />
                                            <TextInput
                                                id={'alarm_heartbeat_'+(i+1)}
                                                value={data['alarm_heartbeat_'+(i+1)]}
                                                onChange={(e) => setData('alarm_heartbeat_'+(i+1), e.target.value)}
                                                type="number"
                                                className="mt-1 block w-full form-control"
                                                autoComplete="current-alarm_hearbeat"
                                                placeholder="Alarm Heartbeat (seconds)"
                                            />
                                            <InputError message={errors['alarm_heartbeat_'+(i+1)]} className="mt-2" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
            )}
        </>
    );
}
