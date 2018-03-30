namespace lib {
    export class UTFChange {

        /**
         * 把二进数组制转换成字符串
         * @param {number[]} arr 二进制数组
         * @returns {string} 字符串
         */
        public static bytesToString(arr: number[]): string {
            //arr = arr.reverse();
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] < 0) arr[i] += 256;
            }
            var res = [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == 0) continue;
                if ((arr[i] & 128) == 0) res.push(arr[i]);				//1位
                else if ((arr[i] & 64) == 0) res.push(arr[i] % 128);		//1位
                else if ((arr[i] & 32) == 0)	//2位
                {
                    res.push((arr[i] % 32) * 64 + (arr[i + 1] % 64));
                    i++;
                }
                else if ((arr[i] & 16) == 0)	//3位
                {
                    res.push((arr[i] % 16) * 64 * 64 + (arr[i + 1] % 64) * 64 + (arr[i + 2] % 64));
                    i++;
                    i++;
                }
                else if ((arr[i] & 8) == 0)	//4位
                {
                    res.push((arr[i] % 8) * 64 * 64 * 64 + (arr[i + 1] % 64) * 64 * 64 + (arr[i + 2] % 64) * 64 + (arr[i + 2] % 64));
                    i++;
                    i++;
                    i++;
                } else {
                    // console.log("?!!!!!!!!!!!!!!!!!!!", arr[i]);
                }
            }
            var str = "";
            for (i = 0; i < res.length; i++) {
                str += String.fromCharCode(res[i]);
            }
            return str;
        }

        /**
         * 把字符串转换成二进制数组
         * @param {string} str 字符串
         * @returns {number[]} 二进制数组
         */
        public static stringToBytes(str: string): number[] {
            var res: number[] = [];
            var num: number;
            for (var i = 0; i < str.length; i++) {
                num = str.charCodeAt(i);
                if (num < 128) {
                    res.push(num);
                }
                else if (num < 2048) {
                    res.push(~~(num / 64) + 128 + 64);
                    res.push((num % 64) + 128);
                }
                else if (num < 65536) {
                    res.push(~~(num / 4096) + 128 + 64 + 32);
                    res.push(~~((num % 4096) / 64) + 128);
                    res.push((num % 64) + 128);
                }
                else {
                    res.push(~~(num / 262144) + 128 + 64 + 32 + 16);
                    res.push(~~((num % 262144) / 4096) + 128);
                    res.push(~~((num % 4096) / 64) + 128);
                    res.push((num % 64) + 128);
                }
            }
            return res;
        }
    }
}