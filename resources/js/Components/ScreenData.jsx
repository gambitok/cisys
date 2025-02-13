import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';

export default function ScreenData({ data,errors,setData }) {

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

    function defaultDataDefine(screenid){
        const newData = { ...data };
        if (newData['banner_height_'+screenid] === undefined) {
            newData['banner_height_'+screenid] = 20;
            newData['text_size_'+screenid] = 0;
            newData['banner_border_'+screenid] = 5;
            newData['hearbeat_'+screenid] = 0;
            newData['center_text_'+screenid] = 'CYBER INTEL SYSTEMS';
            newData['right_text_'+screenid] = 'DEMO';
            newData['banner_color_'+screenid] = '#ff0000';
            newData['text_color_'+screenid] = '#ffffff';
            newData['info_checks_'+screenid] = information_display;
            newData['alarm_code_'+screenid] = 0;
            newData['alarm_message_'+screenid] = '';
            newData['alarm_height_'+screenid] = 20;
            newData['alarm_border_'+screenid] = 5;
            newData['alarm_color_'+screenid] = '#ff0000';
            newData['alarm_text_size_'+screenid] = 0;
            newData['alarm_heartbeat_'+screenid] = 0;
            newData['alarm_center_text_'+screenid] = 'CYBER INTEL SYSTEMS';
            newData['alarm_right_text_'+screenid] = 'DEMO';
            newData['alarm_text_color_'+screenid] = '#ffffff';
            setData(newData);
        }
    }

    function checkboxvaluechecked(name,permission_id) {
        if (data[name] === undefined) {
            return true;
        }
        return (data[name].indexOf(permission_id) > -1);
    }

    return (
        <>
            {Array.from(
                Array(data.screen), (v,i) =>
                <div id={'screenFrom-'+(i+1)} style={{display: data.screenselect==i+1 ? "":"none"}}>
                    {defaultDataDefine(i+1)}
                    {/* <div className='col-md-4'>
                        <div className="mb-3">
                            <InputLabel htmlFor={'banner_height_'+(i+1)} value="Banner Height (px)" />
                            <TextInput
                                id={'banner_height_'+(i+1)}
                                value={data['banner_height_'+(i+1)]}
                                onChange={(e) => setData('banner_height_'+(i+1), e.target.value)}
                                type="number"
                                className="mt-1 block w-full form-control"
                                autoComplete="current-banner_height"
                                placeholder="Banner Height (px)"
                            />
                        </div>
                    </div> */}

                    <div className='row g-3 my-2'>
                        <div className='col-md-6'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className="mb-3">
                                        <InputLabel htmlFor={'banner_height_'+(i+1)} value="Banner Height (px)" />
                                        <TextInput
                                            id={'banner_height_'+(i+1)}
                                            value={data['banner_height_'+(i+1)]}
                                            onChange={(e) => setData('banner_height_'+(i+1), e.target.value)}
                                            type="number"
                                            className="mt-1 block w-full form-control"
                                            autoComplete="current-banner_height"
                                            placeholder="Banner Height (px)"
                                        />
                                         <InputError message={errors['banner_height_'+(i+1)]} className="mt-2" />
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className="mb-3">
                                        <InputLabel htmlFor={'banner_border_'+(i+1)} value="Banner Border (px)" />
                                        <TextInput
                                            id={'banner_border_'+(i+1)}
                                            value={data['banner_border_'+(i+1)]}
                                            onChange={(e) => setData('banner_border_'+(i+1), e.target.value)}
                                            type="number"
                                            className="mt-1 block w-full form-control"
                                            autoComplete="current-banner_border"
                                            placeholder="Banner Height (px)"
                                        />
                                        <InputError message={errors['banner_border_'+(i+1)]} className="mt-2" />
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className="mb-3">
                                        <InputLabel htmlFor={'banner_color_'+(i+1)} value="Banner Color" />
                                        <TextInput
                                            id={'banner_color_'+(i+1)}
                                            value={data['banner_color_'+(i+1)]}
                                            onChange={(e) => setData('banner_color_'+(i+1), e.target.value)}
                                            type="color"
                                            className="mt-1 block w-full form-control"
                                            autoComplete="current-banner_color"
                                            placeholder="Banner Color"
                                        />
                                        <InputError message={errors['banner_color_'+(i+1)]} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className="mb-3">
                                        <InputLabel htmlFor={'center_text_'+(i+1)} value="Center Text" />
                                        <TextInput
                                            id={'center_text_'+(i+1)}
                                            value={data['center_text_'+(i+1)]}
                                            onChange={(e) => setData('center_text_'+(i+1), e.target.value)}
                                            type="text"
                                            className="mt-1 block w-full form-control"
                                            autoComplete="current-center_text"
                                            placeholder="Center Text"
                                        />
                                        <InputError message={errors['center_text_'+(i+1)]} className="mt-2" />
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className="mb-3">
                                        <InputLabel htmlFor={'right_text_'+(i+1)} value="Right text" />
                                        <TextInput
                                            id={'right_text_'+(i+1)}
                                            value={data['right_text_'+(i+1)]}
                                            onChange={(e) => setData('right_text_'+(i+1), e.target.value)}
                                            type="text"
                                            className="mt-1 block w-full form-control"
                                            autoComplete="current-right_text"
                                            placeholder="Right text"
                                        />
                                        <InputError message={errors['right_text_'+(i+1)]} className="mt-2" />
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className="mb-3">
                                        <InputLabel htmlFor={'text_color_'+(i+1)} value="Text Color" />
                                        <TextInput
                                            id={'text_color_'+(i+1)}
                                            value={data['text_color_'+(i+1)]}
                                            onChange={(e) => setData('text_color_'+(i+1), e.target.value)}
                                            type="color"
                                            className="mt-1 block w-full form-control"
                                            autoComplete="current-text_color"
                                            placeholder="Text Color"
                                        />
                                        <InputError message={errors['text_color_'+(i+1)]} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className="mb-3">
                                        <InputLabel htmlFor={'text_size_'+(i+1)} value="Text Size (pt)" />
                                        <TextInput
                                            id={'text_size_'+(i+1)}
                                            value={data['text_size_'+(i+1)]}
                                            onChange={(e) => setData('text_size_'+(i+1), e.target.value)}
                                            type="number"
                                            className="mt-1 block w-full form-control"
                                            autoComplete="current-banner_height"
                                            placeholder="Text Size (pt)"
                                        />
                                         <InputError message={errors['text_size_'+(i+1)]} className="mt-2" />
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className="mb-3">
                                        <InputLabel htmlFor={'hearbeat_'+(i+1)} value="Hearbeat (seconds)" />
                                        <TextInput
                                            id={'hearbeat_'+(i+1)}
                                            value={data['hearbeat_'+(i+1)]}
                                            onChange={(e) => setData('hearbeat_'+(i+1), e.target.value)}
                                            type="number"
                                            className="mt-1 block w-full form-control"
                                            autoComplete="current-banner_border"
                                            placeholder="Hearbeat (seconds)"
                                        />
                                        <InputError message={errors['hearbeat_'+(i+1)]} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-6'>
                            <InputLabel value="Computer Information Display" />
                            <div className='row g-3 my-2'>
                                {information_display.map((item) => (
                                    <div className='col-md-6'>
                                        <label className="flex items-center">
                                            <Checkbox name={'info_checks_'+(i+1)} value={item} handleChange={handleChange} checked={checkboxvaluechecked('info_checks_'+(i+1),item)} />
                                            <span className="ml-2 text-sm text-gray-600">{item}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>



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
