import {ParsedQs} from 'qs'

//Creating custom type, since we are going to pass date from
//query string as 'currVal' inside the following helper func
type CurrentDate = ParsedQs | string | string[] | ParsedQs[]

export function validateDate(currVal: CurrentDate) {

    //Checking type so that the regex.match doesn't throw an error
    if(typeof currVal !== 'string') return false
    if (currVal == '') return false;

    //Declare Regex
    const rxDatePattern = /^(\d{1,2})(\/|-)(?:(\d{1,2})|(january)|(february)|(march)|(april)|(may)|(june)|(july)|(august)|(september)|(october)|(november)|(december))(\/|-)(\d{4})$/i;

    const dtArray = currVal.match(rxDatePattern);

    if (dtArray == null) return false;

    let dtDay: number = parseInt(dtArray[1]);
    let dtMonth: number = parseInt(dtArray[3]);
    let dtYear: number = parseInt(dtArray[17]);

    if (isNaN(dtMonth)) {
        for (let i = 4; i <= 15; i++) {
            if ((dtArray[i])) {
                dtMonth = i - 3;
                break;
            }
        }
    }

    if (dtMonth < 1 || dtMonth > 12) return false;
    else if (dtDay < 1 || dtDay > 31) return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) return false;
    else if (dtMonth == 2) {
        const isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap)) return false;
    }

    return true;
}
