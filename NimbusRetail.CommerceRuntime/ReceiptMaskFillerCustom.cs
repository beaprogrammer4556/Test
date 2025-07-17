namespace NimbusRetail
{
    namespace CommerceRuntime
    {
		using System;
		using System.Collections.Generic;
		using System.Collections.ObjectModel;

		sealed public class ReceiptMaskFillerCustom
        {

            private ReceiptMaskFillerCustom() { }

            struct FormatBlock
            {
                public char blockChar;
                public int startIdx;
                public int length;

                public FormatBlock(char blockChar, int startIdx, int length)
                {
                    this.blockChar = blockChar;
                    this.startIdx = startIdx;
                    this.length = length;
                }
            }


            /// <summary>
            /// Given a mask and lots of possible parameters fill in the template mask
            /// </summary>
            /// <param name="receiptMask">Template mask for receipt Id</param>
            /// <param name="storeId">Store Id</param>
            /// <param name="terminalId">Terminal Id</param>
            /// <param name="staffId">Staff Id</param>
            /// <param name="seedValue">Receipt number, the sequential part of the receipt Id</param>
            /// <returns>Populated receipt ID from mask</returns>
            static public string FillMask(string receiptMask, string seedValue, string storeId, string terminalId, string staffId)
            {
                return FillMask(receiptMask, seedValue, storeId, terminalId, staffId, DateTime.Now);
            }



            static public string FillMask(string receiptMask, string seedValue, string storeId, string terminalId, string staffId, DateTime currentDate)
            {
                string receiptId = receiptMask;

                // Get list of blocks in mask
                ReadOnlyCollection<FormatBlock> blockList = GetFormatBlocks(receiptId, new char[] { 'S', 'T', 'C', '#', 'd', 'M', 'D', 'Y' });

                // For each block, fill with contents
                foreach (FormatBlock formatBlock in blockList)
                {
                    switch (formatBlock.blockChar)
                    {
                        case 'S':
                            receiptId = FillBlock(receiptId, formatBlock, storeId);
                            break;

                        case 'T':
                            receiptId = FillBlock(receiptId, formatBlock, terminalId);
                            break;

                        case 'C':
                            receiptId = FillBlock(receiptId, formatBlock, staffId);
                            break;

                        case '#':
                            receiptId = FillBlock(receiptId, formatBlock, seedValue);
                            break;

                        case 'd':
                            if (formatBlock.length >= 3) // ddd is a valid block but dd isn't
                            {
                                receiptId = FillBlock(receiptId, formatBlock, currentDate.DayOfYear.ToString());
                            }
                            break;

                        case 'D':
                            if (formatBlock.length >= 2) // DD is a valid block but D isn't
                            {
                                receiptId = FillBlock(receiptId, formatBlock, currentDate.Day.ToString());
                            }
                            break;

                        case 'M':
                            if (formatBlock.length >= 2)
                            {
                                receiptId = FillBlock(receiptId, formatBlock, currentDate.Month.ToString());
                            }
                            break;

                        case 'Y':
                            if (formatBlock.length >= 2)
                            {
                                receiptId = FillBlock(receiptId, formatBlock, currentDate.Year.ToString());
                            }
                            break;

                        default:
                            break;
                    }
                }

                // if empty mask, default to seed number
                if (string.IsNullOrEmpty(receiptId))
                {
                    receiptId = seedValue.ToString();
                }

                return receiptId;
            }


            static private ReadOnlyCollection<FormatBlock> GetFormatBlocks(string mask, char[] formatChars)
            {
                List<FormatBlock> blockList = new List<FormatBlock>();
                int currentIdx;
                int startBlockIdx;
                int endBlockIdx;
                int blockLength;

                currentIdx = mask.IndexOfAny(formatChars);
                while (currentIdx < mask.Length &&
                    currentIdx >= 0)
                {
                    //Find the next template block
                    startBlockIdx = currentIdx;
                    endBlockIdx = FindEndOfBlock(mask, startBlockIdx);
                    blockLength = endBlockIdx - startBlockIdx + 1;

                    //Add block to list
                    blockList.Add(new FormatBlock(mask[startBlockIdx], startBlockIdx, blockLength));

                    //Increment to next block start
                    currentIdx = mask.IndexOfAny(formatChars, endBlockIdx + 1);
                }

                return new ReadOnlyCollection<FormatBlock>(blockList);
            }


            static private string FillBlock(string template, FormatBlock formatBlock, string contents)
            {
                string filledTemplate = template;

                string trimmed = contents.PadLeft(formatBlock.length, '0');
                trimmed = trimmed.Substring(trimmed.Length - formatBlock.length);
               // trimmed = trimmed.Substring(0, formatBlock.length); 

                filledTemplate = filledTemplate.Remove(formatBlock.startIdx, formatBlock.length);
                filledTemplate = filledTemplate.Insert(formatBlock.startIdx, trimmed);

                return filledTemplate;
            }

            static private int FindEndOfBlock(string template, int startOfBlock)
            {
                int currentIdx = startOfBlock;
                char blockChar = template[startOfBlock];

                while (currentIdx < template.Length &&
                    template[currentIdx] == blockChar)
                {
                    currentIdx += 1;
                }

                return currentIdx - 1;
            }

        }
    }
}
