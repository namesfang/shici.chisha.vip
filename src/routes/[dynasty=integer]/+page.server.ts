import type { Prisma } from "@prisma/client";
import { client } from "$lib/prisma";
import { error } from "@sveltejs/kit";

export async function load({ params, url }) {

  const keyword = url.searchParams.get('keyword');

  const dynastyId = Number(params.dynasty);

  const dynasty = await client.dynasty.findFirst({
    where: {
      id: dynastyId
    }
  })

  if(!dynasty) {
    return error(404, 'Not Found')
  }

  const page = url.searchParams.get('page');

  const take = 20
  const skip = (Number(page ?? 1) - 1) * take;

  const where = {
    dynastyId,
  } as Prisma.PostWhereInput

  if(keyword) {
    where.title = {
      contains: keyword
    }
  }

  const list = await client.post.findMany({
    where,
    take: take,
    skip: skip,
  })

  const count = await client.post.count({
    where
  })

  // console.log(dynasty)

  return {
    list,
    take,
    count,
    dynasty
  }
}
