/**
 * Copyright (c) 2019 Burst Apps Team
 */
import {BurstService} from '../../../service/burstService';
import {TransactionResponse} from '../../../typings/transactionResponse';
import {Attachment} from '../../../typings/attachment';
import {DefaultDeadline} from '../../../constants';
import {createParametersFromAttachment} from '../../../internal/createParametersFromAttachment';

/**
 * Gets an unsigned transaction bytes.
 * Use with [[ApiComposer]] and belongs to [[TransactionApi]].
 *
 * See details at [[TransactionApi.getTransactionUnsignedBytes]]
 * @module core.api.factories
 *
 */
export const getTransactionUnsignedBytes = (service: BurstService):
    (amountPlanck: string,
     feePlanck: string,
     recipientId: string,
     senderPublicKey: string,
     attachment?: Attachment,
     deadline?: number) => Promise<string> =>
    async (
        amountPlanck: string,
        feePlanck: string,
        recipientId: string,
        senderPublicKey: string,
        attachment: Attachment = null,
        deadline = DefaultDeadline
    ): Promise<string> => {

        let parameters = {
            amountNQT: amountPlanck,
            publicKey: senderPublicKey,
            recipient: recipientId,
            feeNQT: feePlanck,
            deadline
        };

        if (attachment) {
            parameters = createParametersFromAttachment(attachment, parameters);
        }

        const {unsignedTransactionBytes} = await service.send<TransactionResponse>('sendMoney', parameters);

        return unsignedTransactionBytes;

    };
